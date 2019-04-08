import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { TbPricecf } from '../home/models/tb-pricecf';
import { LogPricecfImp } from '../home/models/logPricecfImp';


@Injectable({ providedIn: 'root' })
export class Mmt1i050Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getTbPricecf(tbPrice: TbPricecf): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbPricecf>(this.apiUrl + '/mmt1i050/getPricecf', tbPrice)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    getCountTbPricecf(tbPrice: TbPricecf): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i050/getCountPricecfList', tbPrice)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    addTbPricecf(tbPrice: TbPricecf) {
        return this.http.post<TbPricecf>(this.apiUrl + '/mmt1i050/addPricecf/', tbPrice);
    }

    editTbPricecf(tbPrice: TbPricecf) {
        return this.http.put<TbPricecf>(this.apiUrl + '/mmt1i050/updatePricecf/', tbPrice);
    }

    // deleteTbPricecf(supSerial: number) {
    //     return this.http.delete(this.apiUrl + '/mmt1i050/deleteTbPricecf/' + supSerial);
    // }

    deleteTbPricecfList(tbPriceList: TbPricecf[]) {
        return this.http.post(this.apiUrl + '/mmt1i050/deletePricecfList/', tbPriceList);
    }

    getLogPricecfImp(logPricecfImp: LogPricecfImp): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<LogPricecfImp>(this.apiUrl + '/mmt1i050//getLogPricecfImp', logPricecfImp)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }
    
    getSupSerialList(): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/lovService/getSupSerialList');
    }
    
    getMSupuseList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMSupuseList');
    }

    getMAuthpplTypeList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMAuthpplTypeList');
    }

    getMDeliveryTagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMDeliveryTagList');
    }

    getMProdTypeList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMProdTypeList');
    }



    getShowFlagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getShowFlagList');
    }
    getProdFlagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getProdFlagList');
    }
    getPartUnitList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getPartUnitList');
    }

    getWeightUnitList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getWeightUnitList');
    }

    getMUseFlagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMUseFlagList');
    }
    getPartFlagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getPartFlagList');
    }
    getPartuseTypeList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getPartuseTypeList');
    }

    getSupSerialThList(): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/lovService/getSupSerialThList');
    }
    getSupSerialThSubCodeList() {
           return this.http.get<any>(this.apiUrl + '/lovService/getSupSerialThSubCodeList');
       }


}
