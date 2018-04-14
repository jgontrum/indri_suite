export interface DocumentReference {
  query_id: string;
  document_id: string;
  document: string;
  score: number;
  index: number;
}

export interface SearchResults {
  size: number;
  documents: DocumentReference[];
}
