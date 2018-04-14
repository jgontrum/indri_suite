import os

from indri_suite import logger
from indri_suite import options
from indri_suite.common.cli_clients import IndriCLIClient
from indri_suite.common.indri_client import IndriClient, BadQueryException


def post(request, size, page):
    logger.info("Received search request: '{}'.".format(request))

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

    try:
        ret = indri_client.query(request['query'], size, page)
    except BadQueryException as e:
        logger.warning("Failed to evaluate request: {}".format(e))
        return str(e), 400

    logger.info("Successfully searched for '{}'.".format(request['query']))
    return ret, 200
