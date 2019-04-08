import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';
import { TbUnit } from '../home/models/tb-unit';

//import { FactoryService } from '@libs/services/factory/factoryservice.service';


@Injectable({ providedIn: 'root' })
export class Mmt1i060Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getUnit(tbUnit:TbUnit): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbUnit>(this.apiUrl + '/mmt1i060/getUnit',tbUnit)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    getCountUnit(tbUnit:TbUnit): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i060/getCountUnitList',tbUnit)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    addUnit(tbUnit:TbUnit){
        console.log(tbUnit)
        return this.http.post<TbUnit>(this.apiUrl + '/mmt1i060/addUnit/',tbUnit);
    }

    editUnit(tbUnit:TbUnit){
        return this.http.put<TbUnit>(this.apiUrl + '/mmt1i060/updateUnit/',tbUnit);
    }

    // deleteConsignee(consignSerial:number){
    //     return this.http.delete(this.apiUrl + '/mmt1i060/deleteConsignee/',consignSerial);
    // }
    deleteUnitList(tbUnit:TbUnit[]){
        return this.http.post(this.apiUrl + '/mmt1i060/deleteUnitList/',tbUnit);
    }

    // getbyrSerialList(): Observable<any> {
    //     // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
    //      return this.http.get<any>( this.apiUrl + '/lovService/getByrSerialList');
    //  }
    
    //  getSupSerialList(): Observable<any> {
    //      return this.http.get<any>( this.apiUrl + '/lovService/getSupSerialList');
    //  }

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
