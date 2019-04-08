import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FwQueryUtilsService {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getTbSupplierById(id) {
        return this.http.get<any>(this.apiUrl + '/queryUtils/getTbSupplierById/' + id);
    }
}
