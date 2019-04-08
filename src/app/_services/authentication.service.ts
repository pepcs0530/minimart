import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient,
        private router: Router,
        private userService: UserService) { }

    login(username: string, password: string , recaptchaResponse: string) {
        return this.userService.login(username, password,recaptchaResponse)
            .pipe(
                map(user => {
                    // login successful if there's a jwt token in the response
                    if (user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                         localStorage.setItem('currentUser', JSON.stringify(user));
                        // this.userStorageService.setUser(user); 
                    }
                    return user;
                }, error => {
                    return error;
                }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/auth/signin']);
    }

    isAuthenticated(): boolean {
        return localStorage.getItem('currentUser') === null ? false : true;
    }

    getMenu() {
        const user =  JSON.parse(localStorage.getItem('currentUser'));
        return this.userService.getMenu(user.token)
            .pipe(
                map(res => {
                    if (res) {
                        user.menu = res;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                    return res;
                }, error => {
                    return error;
                }));
    }
}
