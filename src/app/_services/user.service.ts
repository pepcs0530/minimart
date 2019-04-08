import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { AccessLog } from '../home/models/access-log';


@Injectable({ providedIn: 'root' })
export class UserService {

    apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User>(this.apiUrl + '/auth/me');
    }

    getById(id: number) {
        return this.http.get(this.apiUrl + '/users/' + id);
    }

    register(user: User) {
        return this.http.post(this.apiUrl + '/auth/signup', user);
    }

    update(user: User) {
        return this.http.put(this.apiUrl + '/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + '/users/' + id);
    }
    login(username: string, password: string,recaptchaResponse) {
        
        return this.http.post<any>(this.apiUrl + '/auth/signin', { userId: username, password: password, recaptchaResponse: recaptchaResponse });
    }

    getMenu(token: string) {
        return this.http.get<any>(this.apiUrl + '/auth/menu?token=' + token);
    }

    addLog(accessLog:AccessLog){
        return this.http.post<AccessLog>(this.apiUrl + '/logService/addLog/',accessLog);
    }
}
