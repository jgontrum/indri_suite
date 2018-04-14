import { Component, ComponentFactory, ComponentFactoryResolver, ViewChildren, ViewContainerRef } from '@angular/core';
import { EvalResponse } from '../../../models/eval.model';
import { BackendService } from '../../../shared/backend.service';
import { InlineMessageComponent } from '../search/search.component';
import { ConfigService } from '../../../shared/config.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.styl']
})
export class EvaluateComponent {
  query = ConfigService.evalQuery;
  queryId = ConfigService.evalQueryId;
  error = undefined;
  searchInProgress = false;
  results: EvalResponse;

  recallData: any;
  precisionData: any;

  @ViewChildren('tableRow', {read: ViewContainerRef}) rowContainersRelevantDocuments;
  expandedRowRelevantDocuments: number;

  @ViewChildren('tableRow', {read: ViewContainerRef}) rowContainersRelevantRetrievedDocuments;
  expandedRowRelevantRetrievedDocuments: number;

  @ViewChildren('tableRow', {read: ViewContainerRef}) rowContainersRetrievedDocuments;
  expandedRowRetrievedDocuments: number;

  constructor(private backendService: BackendService,
              private resolver: ComponentFactoryResolver,
              public snackBar: MatSnackBar) {
  }

  search() {
    this.searchInProgress = true;
    ConfigService.evalQuery = this.query;
    ConfigService.evalQueryId = this.queryId;

    this.backendService.getEvaluationResults(this.query, this.queryId).subscribe(
      (response: EvalResponse) => {
        this.snackBar.open('Evaluation updated.', 'OK', {duration: 2000});
        this.results = response;
        this.error = undefined;
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
      },
      (error) => {
        console.log(error);
        this.error = error.error;
        this.results = undefined;
      }
    );
  }


  insertComponentForRelevantDocuments(index: number) {
    if (this.expandedRowRelevantDocuments != null) {
      this.rowContainersRelevantDocuments.toArray()[this.expandedRowRelevantDocuments].clear();
    }

    if (this.expandedRowRelevantDocuments === index) {
      this.expandedRowRelevantDocuments = null;
    } else {
      const container = this.rowContainersRelevantDocuments.toArray()[index];
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InlineMessageComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.document = this.results.relevant_documents[index].document;
      this.expandedRowRelevantDocuments = index;
    }
  }

  insertComponentForRelevantRetrievedDocuments(index: number) {
    if (this.expandedRowRelevantRetrievedDocuments != null) {
      this.rowContainersRelevantRetrievedDocuments.toArray()[this.expandedRowRelevantRetrievedDocuments].clear();
    }

    if (this.expandedRowRelevantRetrievedDocuments === index) {
      this.expandedRowRelevantRetrievedDocuments = null;
    } else {
      const container = this.rowContainersRelevantRetrievedDocuments.toArray()[index];
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InlineMessageComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.document = this.results.relevant_retrieved[index].document;
      this.expandedRowRelevantRetrievedDocuments = index;
    }
  }

  insertComponentForRetrievedDocuments(index: number) {
    if (this.expandedRowRetrievedDocuments != null) {
      this.rowContainersRetrievedDocuments.toArray()[this.expandedRowRetrievedDocuments].clear();
    }

    if (this.expandedRowRelevantDocuments === index) {
      this.expandedRowRetrievedDocuments = null;
    } else {
      const container = this.rowContainersRetrievedDocuments.toArray()[index];
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InlineMessageComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.document = this.results.retrieved_documents[index].document;
      this.expandedRowRetrievedDocuments = index;
    }
  }

}
