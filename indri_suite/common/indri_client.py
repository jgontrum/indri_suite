import glob
import hashlib
import json
import logging
import os
import re
import time
from copy import copy

from dicttoxml import dicttoxml


class BadQueryException(ValueError):
    pass


class IndriClient:

    def __init__(self, index_path: object, corpus_path: object,
                 indri_cli: object,
                 tmp_folder: object = "./tmp"):
        self.logger = logging.getLogger('main')

        self.corpus_path = corpus_path
        self.index_path = index_path
        self.indri_cli = indri_cli
        self.tmp_folder = tmp_folder

        if self.tmp_folder[-1] != "/":
            self.tmp_folder += "/"

        if self.index_path[-1] != "/":
            self.index_path += "/"

        if self.corpus_path[-1] != "/":
            self.corpus_path += "/"

        # Create a prefix for any temp files based on the used index.
        self.tmp_folder += str(
            hashlib.md5(self.index_path.encode()).hexdigest()) + "_"

        # Map all document ids to their filepath so that we can access them
        # quickly later on.
        self.document_index = self.create_document_to_index_file_mapping()


    def create_document_to_index_file_mapping(self):
        """
        Iterates over all documents in the corpus, and creates a mapping from
        document id to their position (filename, line number).
        """
        try:
            return json.load(open(self.tmp_folder + "document_index.json"))
        except FileNotFoundError:
            document_index = {}
            for filename in glob.iglob(self.corpus_path + '*'):
                current_document = ""
                start_index = 0
                for i, line in enumerate(open(filename, errors='ignore')):
                    current_document += line
                    if line.startswith("</DOC>"):
                        doc_id = re.findall(
                            r"<DOCID>(.*)</DOCID>", current_document)[0]

                        document_index[doc_id] = {
                            "filename": filename,
                            "start_line": start_index,
                            "end_line": i
                        }

                        current_document = ""
                        start_index = i + 1
            json.dump(document_index,
                      open(self.tmp_folder + "document_index.json", "w"),
                      sort_keys=True, indent=2)

            return document_index

    def return_documents_for_result(self, result):
        ret = copy(result)
        ret['document'] = self.lookup_document(
            self.document_index.get(ret['document_id']))
        return ret

    def lookup_document(self, document_ref):
        """
        Given a document id, it looks it up in our mapping, opens the
        corresponding file in the corpus and returns the whole document.
        :param document_ref:
        :return:
        """
        if not document_ref:
            return "Document not available."
        document = ""
        for i, line in enumerate(
                open(document_ref['filename'], errors='replace')):
            if i >= document_ref['start_line']:
                document += line
            if i > document_ref['end_line']:
                break
        return document.strip()  # .replace("\n", "<br>")

    def _create_query_file(self, query, query_id="0"):
        """
        Creates the XML file needed to query the Indri system.
        :param query:
        :param query_id:
        :return:
        """
        search_query = {
            "index": self.index_path,
            "trecFormat": "true",
            "query": {
                "number": query_id,
                "text": query
            }

        }

        dom = dicttoxml(
            search_query, custom_root='parameters', attr_type=False)

        dom_str = dom.decode().replace(
            '<?xml version="1.0" encoding="UTF-8" ?>', '')

        query_hash = hashlib.md5(dom_str.encode()).hexdigest()

        path = self.tmp_folder + "query_" + query_hash + ".xml"

        with open(path, "w") as f:
            f.write(dom_str)

        return path

    def _parse_query_result(self, query_result):
        """
        Iterate over the result from IndriRunQuery and store it in a structured
        way.
        :param query_result:
        :return:
        """
        results = []
        for line in query_result.decode().split("\n"):
            if not line.strip():
                continue

            _, query_id, document, result_no, score, _ = line.strip().split()
            results.append({
                "query_id": query_id,
                "document_id": document,
                "score": float(score),
                "index": int(result_no)
            })
        return results

    def raw_query(self, query, query_id="0"):
        """
        Create a query file for the query, call Indri, delete the file
        and return the unparsed result. Beware that the return type is
        not string, but binary.
        :param query:
        :param query_id:
        :return:
        """
        query_file_path = self._create_query_file(query, query_id)
        ret = self.indri_cli.run(query_file_path)
        os.remove(query_file_path)
        return ret

    def query(self, query, size=50, page=0):
        """
        Main function for the /search route.
        :param query: Query string
        :param size: Number of documents to return
        :param page: Pagination page
        :return:
        """
        t = time.time()
        query_output = self.raw_query(query)

        try:
            query_results = self._parse_query_result(query_output)
        except ValueError:
            raise BadQueryException(query_output.decode())

        self.logger.info("Search: Search took {0:.2f}s".format(
            time.time() - t))
        t = time.time()

        # Lookup the documents for the document ids
        full_results = []
        for result in query_results[size * page: size * (page + 1)]:
            full_results.append(self.return_documents_for_result(result))

        self.logger.info("Search: Document lookup took {0:.2f}s".format(
            time.time() - t))

        return {
            "size": len(query_results),
            "documents": full_results
        }
