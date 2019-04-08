import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FwUploadFile } from '../../models/fw-upload-file/fw-upload-file';
import { map, catchError, tap } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';

@Injectable()
export class FwUploadDownloadFileService {

    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) {
    }

    uploadFile(fwUploadFile: FwUploadFile): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<FwUploadFile>(this.apiUrl + '/api/file/uploadFile', fwUploadFile, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
        ));
    }

    uploadMultipleFiles(fwUploadFiles: Array<FwUploadFile>): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<FwUploadFile>(this.apiUrl + '/api/file/uploadMultipleFiles', fwUploadFiles, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
        ));
    }

    /* downloadFile(fileName) {
        return this.http.get(this.apiUrl + '/api/file/downloadFile/' + fileName)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
        ));
    } */

    downloadFile(fileName): Observable<Blob> {
        const options = { responseType: 'blob' as 'json' };
        return this.http.get<Blob>(this.apiUrl + '/api/file/downloadFile/' + fileName, options);
    }

    /* exportFile(obj: Object) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-download'
            })
        };

        return this.http.post<any>(this.apiUrl + '/api/report/export', obj, httpOptions)
            .pipe(map(res => res),
            catchError(catchError(e => throwError(e))
        ));
    } */

    exportFile(obj: Object) {
        // const options = { responseType: 'blob' as 'json' };
        // return this.http.post<Blob>(this.apiUrl + '/api/report/export', obj, options);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any>('/jasperserver/rest_v2/reports/reports/inv1r010.pdf', httpOptions);
    }
}
