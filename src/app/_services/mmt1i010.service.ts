import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';
import { TbBuyer } from '../home/models/tb-buyer';


//import { FactoryService } from '@libs/services/factory/factoryservice.service';


@Injectable({ providedIn: 'root' })
export class Mmt1i010Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getBuyer(tbBuyer:TbBuyer): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbBuyer>(this.apiUrl + '/mmt1i010/getBuyer',tbBuyer)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    getCountBuyer(tbBuyer:TbBuyer): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i010/getCountBuyer',tbBuyer)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    addTbBuyer(tbBuyer:TbBuyer){
        return this.http.post<TbBuyer>(this.apiUrl + '/mmt1i010/addBuyer/',tbBuyer);
    }

    editTbBuyer(tbBuyer:TbBuyer){
        return this.http.put<TbBuyer>(this.apiUrl + '/mmt1i010/updateBuyer/',tbBuyer);
    }

    deleteTbBuyer(byrSerial:number){
        return this.http.delete(this.apiUrl + '/mmt1i010/deleteBuyer/' + byrSerial);
    }

    getMsts(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMsts');
     }

     getMCountry(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMCountry');
     }

     getMFreezone(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMFreezone');
     }

     getMBusiness(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMBusiness');
     }

     getMProvince(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMProvince');
     }
   
     generateCaptchaImage(): any {
        console.log('generateCaptchaImage');
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get<any>(this.apiUrl + '/mmt1i010/generateCaptchaImage')
        .pipe(
            tap(res => console.log('res--->', res)),
            catchError(catchError(e => throwError(e))
        ));
    }
}
