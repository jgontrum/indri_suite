import { NgModule } from '@angular/core';
import { MainContainerComponent } from './main-container/main-container.component';
import { MaterialModule } from './material.module';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { DataTableComponent } from './data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { MiniStatComponent } from './mini-stat/mini-stat.component';
import { SafehtmlPipe } from './safehtml.pipe';


@NgModule({
  imports: [
    MaterialModule,
    CommonModule
  ],
  declarations: [
    MainContainerComponent,
    DocumentViewerComponent,
    DataTableComponent,
    MiniStatComponent,
    SafehtmlPipe
  ],
  exports: [
    MainContainerComponent,
    DocumentViewerComponent,
    DataTableComponent,
    MiniStatComponent
  ]
})
export class CommonModules {
}
