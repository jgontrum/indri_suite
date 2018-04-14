import subprocess


class IndriCLIClient:

    def __init__(self, indri_query_bin):
        self.indri_query_bin = indri_query_bin

    def run(self, query_file_path):
        return subprocess.check_output(
            [self.indri_query_bin, query_file_path])


class TrecEvalCLIClient:

    def __init__(self, trec_eval_bin):
        self.trec_eval_bin = trec_eval_bin

    def run(self, gold_eval_path, query_result_path):
        return subprocess.check_output(
            [self.trec_eval_bin, '-q', '-m', 'official',
             gold_eval_path, query_result_path])
