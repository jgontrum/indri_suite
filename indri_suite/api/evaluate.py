import os

from indri_suite import logger
from indri_suite import options
from indri_suite.common.cli_clients import IndriCLIClient, TrecEvalCLIClient
from indri_suite.common.indri_client import IndriClient, BadQueryException
from indri_suite.common.trec_eval_client import TrecEvalClient


def post(request):
    logger.info("Received evaluation request: '{}'.".format(request))

    if not os.path.isfile(request['settings']['gold_eval_path']):
        return "Qrel file not found: {}. Please use absolute paths.".format(
            request['settings']['gold_eval_path']), 400

    if not os.path.isdir(request['settings']['index_path']):
        return "Index directory not found: {}. Please use absolute paths.".format(
            request['settings']['index_path']), 400

    if not os.path.isdir(request['settings']['corpus_path']):
        return "Corpus directory not found: {}. Please use absolute paths.".format(
            request['settings']['corpus_path']), 400

    indri_client = IndriClient(
        request['settings']['index_path'],
        request['settings']['corpus_path'],
        IndriCLIClient(options['bin']['indri_query']),
        tmp_folder=options['tmp_folder']
    )

    eval_client = TrecEvalClient(
        request['settings']['gold_eval_path'],
        indri_client,
        TrecEvalCLIClient(options['bin']['trec_eval'])
    )

    try:
        ret = eval_client.evaluate(request['query'], request['query_id'])
    except BadQueryException as e:
        message = str(e)
        if not str(e):
            message = "No relevant documents found, trec_eval failed."

        logger.warning("Failed to evaluate request: {}".format(message))
        return message, 400

    logger.info("Successfully evaluated request.".format(request))
    return ret, 200
