import { Component } from '@angular/core';
import { EvalResponse } from '../../../models/eval.model';
import { BackendService } from '../../../shared/backend.service';
import { ConfigService } from '../../../shared/config.service';
import { MatSnackBar } from '@angular/material';
import { UistateService } from '../../../shared/uistate.service';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.styl']
})
export class EvaluateComponent {
  query = ConfigService.evalQuery;
  queryId = ConfigService.evalQueryId;
  inspectDocument = ConfigService.evalInspectId;
  inspectDocumentData = {
    text: '',
    categories: []
  };
  error = undefined;
  searchInProgress = false;
  highlighting = true;
  results: EvalResponse = {
    eval: {}
  };

  oldResults: EvalResponse;

  recallData: any;
  precisionData: any;

  constructor(private backendService: BackendService,
              private uistateService: UistateService,
              public snackBar: MatSnackBar) {
  }

  static extractSearchTerms(query: string): string {
    return query.replace(/#\w+/g, '').match(/\w+/g).join('|');
  }

  search() {
    this.searchInProgress = true;
    ConfigService.evalQuery = this.query;
    ConfigService.evalQueryId = this.queryId;
    ConfigService.evalInspectId = this.inspectDocument;

    this.backendService.getEvaluationResults(this.query, this.queryId).subscribe(
      (response: EvalResponse) => {
        this.oldResults = this.results;
        this.results = response;
        this.error = undefined;

        // Prepare data for the charts
        const recallData = [
          {
            'name': 'Recall',
            'series': []
          }
        ];
        for (let i = 0; i <= 10; i++) {
          recallData[0]['series'].push(
            {
              'value': response.eval[`iprec_at_recall_${(i / 10).toFixed(2)}`],
              'name': (i / 10).toFixed(2)
            }
          );
        }
        this.recallData = recallData;

        const precisionData = [
          {
            'name': 'Precision',
            'series': []
          }
        ];
        for (const i of [5, 10, 15, 20, 30, 100, 200, 500, 1000]) {
          precisionData[0]['series'].push(
            {
              'value': response.eval[`P_${i}`],
              'name': i
            }
          );
        }
        this.precisionData = precisionData;

        this.updateInspectedDocument(this.inspectDocument);

        this.changeHighlighting();

        this.snackBar.open('Evaluation updated.', 'OK', {duration: 2000});
        this.searchInProgress = false;
      },
      (error) => {
        console.log(error);
        this.error = error.error;
        this.results = {
          eval: {}
        };

        this.searchInProgress = false;
      }
    );
    return false;
  }

  changeHighlighting() {
    if (this.highlighting) {
      this.uistateService.highlight = EvaluateComponent.extractSearchTerms(
        this.query);
    } else {
      this.uistateService.highlight = '';
    }
  }

  updateInspectedDocument(inspectDocument) {
    // Show the inspected document first and also tell where we found it.

    this.inspectDocument = inspectDocument;
    this.inspectDocumentData = {
      text: '',
      categories: []
    };

    // Search for inspected document
    if (inspectDocument && this.results) {
      const lookup = {
        'False Positives': this.results.irrelevant_retrieved,
        'False Negatives': this.results.relevant_not_retrieved,
        'True Positives': this.results.relevant_retrieved,
        'True Negatives': this.results.relevant_documents
      };

      for (const [category, documents] of Object.entries(lookup)) {
        for (const document of documents) {
          if (document.document_id === inspectDocument.trim()) {
            this.inspectDocumentData.text = document.document;
            this.inspectDocumentData.categories.push(category);
          }
        }
      }

      if (this.inspectDocumentData.categories.length === 2) {
        this.inspectDocumentData.categories = [
          this.inspectDocumentData.categories[0]];
      }
    }
  }

}
