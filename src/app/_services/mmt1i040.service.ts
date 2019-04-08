import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { TbProduct } from '../home/models/tb-product';
import { LogProductImp } from '../home/models/logProductImp';


@Injectable({ providedIn: 'root' })
export class Mmt1i040Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getTbProduct(tbProduct: TbProduct): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbProduct>(this.apiUrl + '/mmt1i040//getProduct', tbProduct)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    getCountTbProduct(tbProduct: TbProduct): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i040//getCountProductList', tbProduct)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    addTbProduct(tbProduct: TbProduct) {
        return this.http.post<TbProduct>(this.apiUrl + '/mmt1i040/addProduct/', tbProduct);
    }

    editTbProduct(tbProduct: TbProduct) {
        return this.http.put<TbProduct>(this.apiUrl + '/mmt1i040/updateProduct/', tbProduct);
    }

    // deleteTbProduct(supSerial: number) {
    //     return this.http.delete(this.apiUrl + '/mmt1i040/deleteTbProduct/' + supSerial);
    // }

    deleteTbProductList(tbProductList: TbProduct[]) {
        return this.http.post(this.apiUrl + '/mmt1i040/deleteProductList/', tbProductList);
    }

    getMProvince(): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/lovService/getMProvince');
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

    getLogProductImp(logProductImp: LogProductImp): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<LogProductImp>(this.apiUrl + '/mmt1i040/getLogProductImp', logProductImp)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

}
