import { NgModule } from '@angular/core';
import { MainContainerComponent } from './main-container/main-container.component';
import { MaterialModule } from './material.module';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { DataTableComponent } from './data-table/data-table.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    MaterialModule,
    CommonModule
  ],
  declarations: [
    MainContainerComponent,
    DocumentViewerComponent,
    DataTableComponent
  ],
  exports: [
    MainContainerComponent,
    DocumentViewerComponent,
    DataTableComponent
  ]
})
export class CommonModules {
}
