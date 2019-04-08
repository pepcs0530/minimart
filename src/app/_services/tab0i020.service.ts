import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';

import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';

//import { FactoryService } from '@libs/services/factory/factoryservice.service';


@Injectable({ providedIn: 'root' })
export class Tab0i020Service {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }


     getMProvince(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/lovService/getMProvince');
     }
}
