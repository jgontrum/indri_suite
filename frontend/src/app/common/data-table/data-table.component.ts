import {
  Component, ComponentFactory, ComponentFactoryResolver, EventEmitter,
  Input, Output, ViewChildren, ViewContainerRef
} from '@angular/core';
import { DocumentReference } from '../../models/search.model';
import { InlineMessageComponent } from '../../site/suite/search/search.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.styl']
})
export class DataTableComponent {
  @Input() dataSource: DocumentReference[];
  @Output() inspect: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('tableRow', {read: ViewContainerRef}) rowContainers;
  expandedRow: number;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  insertComponent(index: number) {
    // Inserts a row with the document.
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

      inlineComponent.instance.document = this.dataSource[index].document;
      this.expandedRow = index;
    }
  }
}
