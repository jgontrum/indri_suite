import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { SearchResults } from '../models/search.model';
import { ConfigService } from './config.service';
import { EvalResponse } from '../models/eval.model';


@Injectable()
export class BackendService {

  constructor(private httpClient: HttpClient) {
  }

  public getSearchResults(query: string, size: number, page: number): Observable<SearchResults> {
    const url = environment.apiBaseUrl + `search?size=${size}&page=${page}`;
    const body = {
      query: query,
      settings: ConfigService.settings
    };

    return this.httpClient.post<SearchResults>(url, body, {
      observe: 'body', responseType: 'json',
      headers: {'Content-type': 'application/json'}
    });
  }

  public getEvaluationResults(query: string, query_id: string): Observable<EvalResponse> {
    const url = environment.apiBaseUrl + `evaluate`;
    const body = {
      query: query,
      query_id: query_id,
      settings: ConfigService.settings
    };

    return this.httpClient.post<EvalResponse>(url, body, {
      observe: 'body', responseType: 'json',
      headers: {'Content-type': 'application/json'}
    });
  }
}
