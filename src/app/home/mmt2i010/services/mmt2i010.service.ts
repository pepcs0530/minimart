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
import { EntityResponse } from 'src/app/shared/models/entity-response/entity-response';
import { MJobStep } from 'src/app/shared/models/m-job-step/m-job-step';

@Injectable({
  providedIn: 'root'
})
export class Mmt2i010Service {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    private _invOrderMasBean: BehaviorSubject<InvOrderMas> = new BehaviorSubject(null);

    getLogDorderImp(logDorderImp: LogDorderImp): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.put<LogDorderImp>(this.apiUrl + '/mmt2i010/getLogDorderImp', logDorderImp)
            .pipe(map(res => res),
                catchError(catchError(e => throwError(e))
            ));
    }

    getInvOrderMas(invOrderMas: InvOrderMas): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/getInvOrderMas', invOrderMas, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getCountInvOrderMas(invOrderMas: InvOrderMas): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/getCountInvOrderMasList', invOrderMas, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
        ));
    }
    
    updateInvOrderMas(invOrderMas: InvOrderMas) {
        return this.http.put<InvOrderMas>(this.apiUrl + '/mmt2i010/updateInvOrderMas/', invOrderMas);
    }

    getInvOrderMasById(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i010/getInvOrderMasById/' + id);
    }

    getInvOrderGroup(invOrderGroup: InvOrderGroup): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/getInvOrderGroup', invOrderGroup, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getInvOrderGroupByOrdermSerial(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i010/getInvOrderGroupByOrdermSerial/' + id);
    }

    confirmData(invOrderMas: InvOrderMas) {
        return this.http.put<InvOrderMas>(this.apiUrl + '/mmt2i010/confirmData/', invOrderMas);
    }

    cancelData(invOrderMas: InvOrderMas) {
        return this.http.put<InvOrderMas>(this.apiUrl + '/mmt2i010/cancelData/', invOrderMas);
    }

    /* exportInvoiceData(invOrderGroup: InvOrderGroup): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/exportInvoiceData', invOrderGroup, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    } */

    exportInvoiceData(id) {
        return this.http.get<any>(this.apiUrl + '/mmt2i010/exportInvoiceData/' + id);
    }

    exportInvoiceDataInvOrderGroup(invOrderMas: InvOrderMas) {
        return this.http.put<any>(this.apiUrl + '/mmt2i010/exportInvoiceDataInvOrderGroup/' , invOrderMas);
    }

    insertInvOrderFilecf(invOrderFilecf: InvOrderFilecf): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/insertInvOrderFilecf', invOrderFilecf, httpOptions)
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

        return this.http.post<InvOrderMas>(this.apiUrl + '/mmt2i010/getInvOrderFilecf', invOrderFilecf, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    updateInvOrderFilecf(invOrderFilecf: InvOrderFilecf) {
        return this.http.put<InvOrderFilecf>(this.apiUrl + '/mmt2i010/updateInvOrderFilecf/', invOrderFilecf);
    }
    
    updateFilecfDate(invOrderFilecf: InvOrderFilecf) {
        return this.http.put<InvOrderFilecf>(this.apiUrl + '/mmt2i010/updateFilecfDate/', invOrderFilecf);
    }

    getIXimpleTypeDFile(invOrderFilecf: InvOrderFilecf): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<EntityResponse>(this.apiUrl + '/mmt2i010/exportIXimpleTypeDFile', invOrderFilecf, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    getMJobStep(mJobStep: MJobStep): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<MJobStep>(this.apiUrl + '/mmt2i010/getMJobStep', mJobStep, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
            ));
    }

    get invOrderMasBean() {
        return this._invOrderMasBean.value;
    }

    set invOrderMasBean(payload: InvOrderMas) {
        this._invOrderMasBean.next(payload);
    }
}
