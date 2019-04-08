import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authen: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {



        if (this.authen.isAuthenticated()) {

            console.log('true');
            // logged in so return true
            return true;
        }

        console.log('falsefalse');

        //console.log(false);
        // not logged in so redirect to login page with the return url
        //alert('check token');
      //  this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
      //alert('aaaa');
      window.location.href = "assets/pages/welcome.html"; 
        return false;
    }
}
