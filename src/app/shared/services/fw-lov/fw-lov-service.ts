import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FwLovService {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    getFwSystem() {
        return this.http.get<any>(this.apiUrl + '/lovService/getFwSystem');
    }

    getTbSupplier() {
        return this.http.get<any>(this.apiUrl + '/lovService/getTbSupplier');
    }

    getTbConsignee() {
        return this.http.get<any>(this.apiUrl + '/lovService/getTbConsignee');
    }

    getMLayoutVers() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMLayoutVers');
    }

    getMTranFz() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMTranFz');
    }

    getMAreaPort() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMAreaPort');
    }

    getMPort() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMPort');
    }

    getMCountry() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMCountry');
    }

    getMMoney() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMMoney');
    }

    getMJob() {
        return this.http.get<any>(this.apiUrl + '/lovService/getMJob');
    }
}
