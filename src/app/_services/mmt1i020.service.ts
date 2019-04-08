import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { TbSupplier } from '../home/models/tb-supplier';


@Injectable({ providedIn: 'root' })
export class Mmt1i020Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getTbSupplier(tbSupplier: TbSupplier): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<TbSupplier>(this.apiUrl + '/mmt1i020/getTbSupplier', tbSupplier)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    getCountTbSupplier(tbSupplier: TbSupplier): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt1i020/getCountTbSupplier', tbSupplier)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
                ));
    }

    getTbSupplierById(id) {
        return this.http.get<any>(this.apiUrl + '/mmt1i020/getTbSupplierById/'+id);
    }

    addTbSupplier(tbSupplier: TbSupplier) {
        return this.http.post<TbSupplier>(this.apiUrl + '/mmt1i020/addTbSupplier/', tbSupplier);
    }

    editTbSupplier(tbSupplier: TbSupplier) {
        return this.http.put<TbSupplier>(this.apiUrl + '/mmt1i020/updateTbSupplier/', tbSupplier);
    }

    deleteTbSupplier(supSerial: number) {
        return this.http.delete(this.apiUrl + '/mmt1i020/deleteTbSupplier/' + supSerial);
    }

    deleteTbSupplierList(tbSupplierList: TbSupplier[]) {
        return this.http.post(this.apiUrl + '/mmt1i020/deleteTbSupplierList/', tbSupplierList);
    }

    getMProvince(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
        return this.http.get<any>(this.apiUrl + '/lovService/getMProvince');
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

    getMUseFlagList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMUseFlagList');
    }

    getMLayoutVersList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMLayoutVersList');
    }

    getMAreaPortList() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMAreaPortList');
    }

    getTbSupplierListForAdd(id) {
        return this.http.get<any>(this.apiUrl + '/lovService/getTbSupplierListForAdd/'+id);
    }
}
