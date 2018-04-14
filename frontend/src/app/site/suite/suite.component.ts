import { Component } from '@angular/core';
import { UistateService } from '../../shared/uistate.service';
import { ConfigService } from '../../shared/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.styl']
})
export class SuiteComponent {

  constructor(private uistateService: UistateService,
              public configService: ConfigService,
              private router: Router) {

    if (this.configService.isConfigured !== 'true') {
      this.router.navigateByUrl('/settings');
    }
  }

  routeIsActive(instruction: any[]) {
    return this.uistateService.isRouteActive(instruction);
  }

}
