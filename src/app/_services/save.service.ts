import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';

//import { FactoryService } from '@libs/services/factory/factoryservice.service';


@Injectable({ providedIn: 'root' })
export class SaveService {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
      //  super();
    }


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

    saveTambon(addSurveyDetModel: ArmtAddSurveyDetModel): Observable<any> {

         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });
         return this.http.post<ArmtAddSurveyDetModel>(this.apiUrl + '/test/message/',addSurveyDetModel)
         .pipe(map(res => res),
         catchError(catchError(e => throwError(e))
         )         
         );


    }    
}
