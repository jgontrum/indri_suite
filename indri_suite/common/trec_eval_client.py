import logging
import os
import subprocess
import time

from indri_suite.common.indri_client import BadQueryException


class TrecEvalClient:

    def __init__(self, gold_eval_path, indri_client, trec_eval_cli):
        self.indri_client = indri_client
        self.gold_eval_path = gold_eval_path
        self.trec_eval_cli = trec_eval_cli
        self.logger = logging.getLogger('main')

    def _process_eval_output(self, eval_output, query_id):
        output = {}
        for line in eval_output.decode().split("\n"):
            if not line.strip():
                continue

            category, current_query_id, score = line.split()

            if current_query_id.strip() == query_id:
                if category.startswith("num"):
                    output[category.strip()] = int(score.strip())
                else:
                    output[category.strip()] = float(score.strip())

        return output

    def _get_gold_documents(self, query_id):
        for line in open(self.gold_eval_path):
            if line.startswith(str(query_id) + " "):
                _, _, doc_id, match = line.split()
                if match.strip() == "1":
                    yield doc_id.strip()

    def _get_retrieved_documents(self, result, query_id):
        for line in result.split("\n"):
            if line.startswith(str(query_id) + " "):
                _, _, doc_id, _, score, _ = line.split()
                yield doc_id.strip(), float(score)

    def _is_query_id_valid(self, query_id):
        for line in open(self.gold_eval_path):
            if line.startswith(str(query_id) + " "):
                return True
        return False

    def evaluate(self, query, query_id):
        if not self._is_query_id_valid(query_id):
            raise BadQueryException("The query id '{}' can not be found "
                                    "in the qrel file.".format(query_id))

        t = time.time()
        query_output = self.indri_client.raw_query(query, query_id)

        filename = self.indri_client.tmp_folder + "query_results_" + \
                   str(int(time.time())) + ".trec"

        with open(filename, "w") as f:
            f.write(query_output.decode())

        self.logger.info("Evaluation: Search took {0:.2f}s".format(
            time.time() - t))
        t = time.time()

        try:
            eval_output = self.trec_eval_cli.run(self.gold_eval_path, filename)
            os.remove(filename)
        except subprocess.CalledProcessError:
            os.remove(filename)
            raise BadQueryException(query_output.decode())

        structured_output = self._process_eval_output(eval_output, query_id)

        self.logger.info("Evaluation: trec_eval took {0:.2f}s".format(
            time.time() - t))
        t = time.time()

        gold_documents = set(self._get_gold_documents(query_id))
        retrieved_documents = [{
            "document_id": doc_id,
            "score": score,
            "index": i
        } for i, (doc_id, score) in enumerate(
            list(
                self._get_retrieved_documents(
                    query_output.decode(), query_id)))
        ]

        relevant_retrieved_documents = gold_documents.intersection(
            set([ref['document_id'] for ref in retrieved_documents])
        )

        irrelevant_retrieved_documents = set(
            [ref['document_id'] for ref in
             retrieved_documents]) - gold_documents

        relevant_not_retrieved_documents = gold_documents - set(
            [ref['document_id'] for ref in
             retrieved_documents])

        ret = {
            "raw_eval_output": eval_output.decode(),
            "eval": structured_output,
            "relevant_documents": [{
                "document_id": doc_id,
                "document": self.indri_client.lookup_document(
                    self.indri_client.document_index.get(
                        doc_id))
            }
                for doc_id in sorted(gold_documents)
            ],
            "irrelevant_retrieved": [{
                "document_id": doc_id,
                "document": self.indri_client.lookup_document(
                    self.indri_client.document_index.get(
                        doc_id))
            }
                for doc_id in sorted(irrelevant_retrieved_documents[:30])
            ],
            "relevant_retrieved": [{
                "document_id": doc_id,
                "document": self.indri_client.lookup_document(
                    self.indri_client.document_index.get(
                        doc_id))
            }
                for doc_id in sorted(relevant_retrieved_documents)
            ],
            "relevant_not_retrieved": [{
                "document_id": doc_id,
                "document": self.indri_client.lookup_document(
                    self.indri_client.document_index.get(
                        doc_id))
            }
                for doc_id in sorted(relevant_not_retrieved_documents)
            ],
            "missing_relevant_documents": list(
                sorted(
                    gold_documents.difference(
                        set(self.indri_client.document_index.keys()))))
        }

        self.logger.info("Evaluation: Document lookup took {0:.2f}s".format(
            time.time() - t))

        return ret
