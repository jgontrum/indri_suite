import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendService } from './backend.service';
import { UistateService } from './uistate.service';
import { ConfigService } from './config.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    BackendService,
    UistateService,
    ConfigService
  ]
})
export class SharedModule {
}
