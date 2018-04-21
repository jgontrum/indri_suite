import { Injectable } from '@angular/core';


@Injectable()
export class ConfigService {
  // Stores all configurations and last values in the search / eval fields.
  // The code is a bit messy as all variables are stored in localstorage
  // and I had to use getter/setter for that.

  static get settings(): object {
    const settings_ = JSON.parse(localStorage.getItem('indriSettings'));
    if (settings_) {
      return settings_;
    } else {
      return {
        'index_path': '',
        'corpus_path': '',
        'gold_eval_path': ''
      };
    }
  }

  static set settings(value: object) {
    localStorage.setItem('indriSettings', JSON.stringify(value));
    localStorage.setItem('indriIsConfigured', 'true');
  }

  static get evalQuery(): string {
    const ret = localStorage.getItem('indriEvalQuery');
    if (!ret) {
      return '';
    }
    return ret;
  }

  static set evalQuery(value: string) {
    localStorage.setItem('indriEvalQuery', value);
  }

  static get evalQueryId(): string {
    const ret = localStorage.getItem('indriEvalQueryId');
    if (!ret) {
      return '';
    }
    return ret;
  }

  static set evalQueryId(value: string) {
    localStorage.setItem('indriEvalQueryId', value);
  }

  static get evalInspectId(): string {
    const ret = localStorage.getItem('indriEvalInspectId');
    if (!ret) {
      return '';
    }
    return ret;
  }

  static set evalInspectId(value: string) {
    localStorage.setItem('indriEvalInspectId', value);
  }


  static get searchQuery(): string {
    const ret = localStorage.getItem('indriSearchQuery');
    if (!ret) {
      return '';
    }
    return ret;
  }

  static set searchQuery(value: string) {
    localStorage.setItem('indriSearchQuery', value);
  }

  get isConfigured(): string | null {
    return localStorage.getItem('indriIsConfigured');
  }

}
