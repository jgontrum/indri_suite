import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './site/settings/settings.component';
import { SuiteComponent } from './site/suite/suite.component';
import { SearchComponent } from './site/suite/search/search.component';
import { EvaluateComponent } from './site/suite/evaluate/evaluate.component';

const routes: Routes = [
  {
    path: '', component: SuiteComponent,
    children: [
      {path: '', redirectTo: 'search', pathMatch: 'full'},
      {path: 'search', component: SearchComponent},
      {path: 'evaluate', component: EvaluateComponent},
      {path: 'settings', component: SettingsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
