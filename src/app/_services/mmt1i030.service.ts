import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';
import { TbConsignee } from '../home/models/tb-consignee';

//import { FactoryService } from '@libs/services/factory/factoryservice.service';


@Injectable({ providedIn: 'root' })
export class Mmt1i030Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getConsignee(tbConsignee:TbConsignee): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbConsignee>(this.apiUrl + '/mmt1i030/getConsignee',tbConsignee)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    getCountConsignee(tbConsignee:TbConsignee): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i030/getCountConsigneeList',tbConsignee)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    addConsignee(tbConsignee:TbConsignee){
        console.log(tbConsignee)
        return this.http.post<TbConsignee>(this.apiUrl + '/mmt1i030/addConsignee/',tbConsignee);
    }

    editConsignee(tbConsignee:TbConsignee){
        return this.http.put<TbConsignee>(this.apiUrl + '/mmt1i030/updateConsignee/',tbConsignee);
    }

    // deleteConsignee(consignSerial:number){
    //     return this.http.delete(this.apiUrl + '/mmt1i030/deleteConsignee/',consignSerial);
    // }
    deleteConsigneeList(tbConsignee:TbConsignee[]){
        return this.http.post(this.apiUrl + '/mmt1i030/deleteConsigneeList/',tbConsignee);
    }

    getbyrSerialList(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getByrSerialList');
     }
    
     getSupSerialList(): Observable<any> {
         return this.http.get<any>( this.apiUrl + '/lovService/getSupSerialList');
     }

    //  getMFreezone(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
        //  return this.http.get<any>( this.apiUrl + '/lovService/getMFreezone');
    //  }

    //  getMBusiness(): Observable<any> {
    //     // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
    //      return this.http.get<any>( this.apiUrl + '/lovService/getMBusiness');
    //  }

    //  getMProvince(): Observable<any> {
    //     // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
    //      return this.http.get<any>( this.apiUrl + '/lovService/getMProvince');
    //  }
}
