import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LogDorderImp } from 'src/app/shared/models/log-dorder-imp';
import { Headers, RequestOptions } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { InvOrderMas } from 'src/app/shared/models/inv-order-mas';
import { InvOrderGroup } from 'src/app/shared/models/inv-order-group';
import { InvOrderFilecf } from 'src/app/shared/models/inv-order-filecf';
import { InvShortMas } from 'src/app/shared/models/inv-short-mas';
import { LogDshortImp } from 'src/app/shared/models/log-dshort-imp';
import { InvShortGroup } from 'src/app/shared/models/inv-short-group';

@Injectable({
  providedIn: 'root'
})
export class Mmt2i020Service {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    private _invShortMasBean: BehaviorSubject<InvShortMas> = new BehaviorSubject(null);

    getLogDshortImp(logDshortImp: LogDshortImp): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.put<LogDshortImp>(this.apiUrl + '/mmt2i020/getLogDshortImp', logDshortImp)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
            ));
    }

    getInvShortMas(invShortMas: InvShortMas): Observable<any> {
        const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
        return this.http.put<InvShortMas>(this.apiUrl + '/mmt2i020/getInvShortMas', invShortMas, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getCountInvShortMas(invShortMas: InvShortMas): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.put<number>(this.apiUrl + '/mmt2i020/getCountInvShortMas', invShortMas)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        ));
    }

    getInvShortMasById(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i020/getInvShortMasById/' + id);
    }

    getInvShortGroup(invShortGroup: InvShortGroup): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvShortGroup>(this.apiUrl + '/mmt2i020/getInvShortGroup', invShortGroup, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getInvShortGroupByOrdermSerial(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i020/getInvShortGroupByOrdermSerial/' + id);
    }

    confirmData(invShortMas: InvShortMas) {
        return this.http.put<InvShortMas>(this.apiUrl + '/mmt2i020/confirmData/', invShortMas);
    }

    cancelData(invShortMas: InvShortMas) {
        return this.http.put<InvShortMas>(this.apiUrl + '/mmt2i020/cancelData/', invShortMas);
    }

    /* exportInvoiceData(invOrderGroup: InvOrderGroup): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i020/exportInvoiceData', invOrderGroup, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    } */

    exportInvoiceData(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i020/exportInvoiceData/' + id);
    }

    exportInvoiceDataInvOrderGroup(invOrderMas: InvOrderMas) {
        return this.http.put<any>(this.apiUrl + '/mmt2i020/exportInvoiceDataInvOrderGroup/' , invOrderMas);
    }

    insertInvOrderFilecf(invOrderFilecf: InvOrderFilecf): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i020/insertInvOrderFilecf', invOrderFilecf, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getInvOrderFilecf(invOrderFilecf: InvOrderFilecf): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i020/getInvOrderFilecf', invOrderFilecf, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    updateInvOrderFilecf(invOrderFilecf: InvOrderFilecf) {
        return this.http.put<InvOrderFilecf>(this.apiUrl + '/mmt2i020/updateInvOrderFilecf/', invOrderFilecf);
    }

    get invShortMasBean() {
        return this._invShortMasBean.value;
    }

    set invShortMasBean(payload: InvShortMas) {
        this._invShortMasBean.next(payload);
    }
}
