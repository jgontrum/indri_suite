import { DocumentReference } from './search.model';

export interface Evaluation {
  P_10?: number;
  P_100?: number;
  P_1000?: number;
  P_15?: number;
  P_20?: number;
  P_200?: number;
  P_30?: number;
  P_5?: number;
  P_500?: number;
  Rprec?: number;
  bpref?: number;
  'iprec_at_recall_0.00'?: number;
  'iprec_at_recall_0.10'?: number;
  'iprec_at_recall_0.20'?: number;
  'iprec_at_recall_0.30'?: number;
  'iprec_at_recall_0.40'?: number;
  'iprec_at_recall_0.50'?: number;
  'iprec_at_recall_0.60'?: number;
  'iprec_at_recall_0.70'?: number;
  'iprec_at_recall_0.80'?: number;
  'iprec_at_recall_0.90'?: number;
  'iprec_at_recall_1.00'?: number;
  map?: number;
  num_rel?: number;
  num_rel_ret?: number;
  num_ret?: number;
  recip_rank?: number;
}

export interface EvalResponse {
  eval: Evaluation;
  raw_eval_output?: string;
  missing_relevant_documents?: string[];
  relevant_documents?: DocumentReference[];
  relevant_retrieved?: DocumentReference[];
  irrelevant_retrieved?: DocumentReference[];
  relevant_not_retrieved?: DocumentReference[];
}
