import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { CommonModules } from '../common/common.module';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { SuiteComponent } from './suite/suite.component';
import { InlineMessageComponent, SearchComponent } from './suite/search/search.component';
import { EvaluateComponent } from './suite/evaluate/evaluate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    CommonModules,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule
  ],
  declarations: [
    SettingsComponent,
    SuiteComponent,
    SearchComponent,
    EvaluateComponent,
    InlineMessageComponent
  ],
  entryComponents: [InlineMessageComponent]
})
export class SiteModule {
}
