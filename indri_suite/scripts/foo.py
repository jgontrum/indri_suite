import json
import time

from indri_suite import options
from indri_suite.common.cli_clients import IndriCLIClient, TrecEvalCLIClient
from indri_suite.common.indri_client import IndriClient
from indri_suite.common.trec_eval_client import TrecEvalClient

if __name__ == '__main__':
    t0 = time.time()
    binaries = options['bin']

    index_path = "/nobackup/gontrum/ir/lab2/GH95_index/"
    corpus_path = "/nobackup/gontrum/ir/lab2/GH95/"
    gold_eval_path = "/nobackup/gontrum/ir/lab2/AH-ENGLISH-CLEF2006.txt"

    indri_cli = IndriCLIClient(binaries['indri_query'])
    trec_eval_cli = TrecEvalCLIClient(binaries['trec_eval'])

    indri_client = IndriClient(
        index_path,
        corpus_path,
        indri_cli,
        tmp_folder=options['tmp_folder']
    )

    eval_client = TrecEvalClient(gold_eval_path, indri_client, trec_eval_cli)

    v = eval_client.evaluate("#uw20(#syn(style catwalk fashion dress clothing "
                             "runway design poses collection) #syn(model "
                             "supermodel start supermodels models))", "324")
    print("FINISHED in %s" % (time.time() - t0))
    print(json.dumps(v, indent=2, sort_keys=True))
