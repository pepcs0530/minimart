import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';

import { Headers, RequestOptions } from '@angular/http';
import { FwMenu } from '../home/models/fw-menu/fw-menu';

@Injectable()
export class FwMenuService {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
      //  super();
    }

    getCountries() {
        return this.http.get<any>('assets/demo/data/countries.json')
                    .toPromise()
                    .then(res => <any[]> res.data)
                    .then(data => data);
    }


    getFwMenu(fwMenu: FwMenu): Observable<any> {

        //alert('getFwMenu');

        console.log('fwMenu===>',fwMenu);


        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put<FwMenu>(this.apiUrl + '/menu/menu/1',fwMenu)
        .pipe(map(res => res),
        catchError(catchError(e => throwError(e))
        )         
        );
   } 

    editFwMenu(fwMenu: FwMenu){

        console.log('editFwMenufwMenuPk====>',fwMenu.fwMenuPk);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
   
    return this.http.put<FwMenu>(this.apiUrl + '/menu/update/',fwMenu);
    }


    addFwMenu(fwMenu: FwMenu){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });       
        return this.http.post<FwMenu>(this.apiUrl + '/menu/add/',fwMenu);
    }

    deleteFwMenu(id: number){           
        return this.http.delete(this.apiUrl + '/menu/delete/' + id);
    }

    getMenuName(): Observable<any> {
        // console.log(this.http.get<any>( this.apiUrl + '/country/provice'));
         return this.http.get<any>( this.apiUrl + '/menu/menuName');          
     }
}
