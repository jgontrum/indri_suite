import { Component, ComponentFactory, ComponentFactoryResolver, Input, ViewChildren, ViewContainerRef } from '@angular/core';
import { SearchResults } from '../../../models/search.model';
import { BackendService } from '../../../shared/backend.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent } from '@angular/material';
import { ConfigService } from '../../../shared/config.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.styl'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SearchComponent {
  query = ConfigService.searchQuery;
  error = undefined;
  searchInProgress = false;
  results: SearchResults;

  displayedColumns = ['index', 'document_id', 'score', 'view'];

  @ViewChildren('tableRow', {read: ViewContainerRef}) rowContainers;
  expandedRow: number;

  constructor(private backendService: BackendService,
              private resolver: ComponentFactoryResolver) {
  }

  search() {
    this.searchInProgress = true;
    ConfigService.searchQuery = this.query;

    this.backendService.getSearchResults(this.query, 10, 0).subscribe(
      (response: SearchResults) => {
        this.results = response;
        this.error = undefined;
      },
      (error) => {
        console.log(error);
        this.error = error.error;
        this.results = undefined;
      });
  }

  paginate(event: PageEvent) {
    this.searchInProgress = true;
    this.backendService.getSearchResults(this.query, 10, event.pageIndex).subscribe((response: SearchResults) => {
      this.results = response;
    });
  }

  insertComponent(index: number) {
    if (this.expandedRow != null) {
      // clear old content
      this.rowContainers.toArray()[this.expandedRow].clear();
    }

    if (this.expandedRow === index) {
      this.expandedRow = null;
    } else {
      const container = this.rowContainers.toArray()[index];
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InlineMessageComponent);
      const inlineComponent = container.createComponent(factory);

      inlineComponent.instance.document = this.results.documents[index].document;
      this.expandedRow = index;
    }
  }
}


/*
* The component that will be dynamically rendered between table rows
*/
@Component({
  selector: 'app-inline-message',
  template: '<app-document-viewer [document]="document"></app-document-viewer>',
  styles: [`
    :host {
      display: flex;
    }
  `]
})
export class InlineMessageComponent {
  @Input() document: string;
}
