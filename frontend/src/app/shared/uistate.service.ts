import {Injectable} from '@angular/core';
import {Router} from '@angular/router';


@Injectable()
export class UistateService {
  constructor(private router: Router) {
  }

  isRouteActive(instruction: any[], exact?: boolean): boolean {
    // [routerLinkActive] does not work with dynamic routes
    // see: https://stackoverflow.com/questions/39271654/routerlinkactive-for-routerlink-with-parameters-dynamic/40528170
    // Set the second parameter to true if you want to require an exact match.
    exact = exact || false;
    return this.router.isActive(this.router.createUrlTree(instruction), exact);
  }
}
