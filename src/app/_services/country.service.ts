import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CountryService {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {}


    getProvince(): Observable<any> {
       // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
        return this.http.get<any>( this.apiUrl + '/country/provice');
    }

    getAmphur( provinceId: number): Observable<any> {
        return this.http.get<any>( this.apiUrl + '/country/amphur?provinceId=' + provinceId);
    }
    getTambon(amphurId: number): Observable<any> {
        return this.http.get<any>( this.apiUrl + '/country/tambon?amphurId=' + amphurId);
    }
}
