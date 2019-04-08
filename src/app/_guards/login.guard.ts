import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {

    constructor(private authen: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {      
        if ( !this.authen.isAuthenticated()) {
            // logged in so return true
          //  alert('22222');
           // this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
