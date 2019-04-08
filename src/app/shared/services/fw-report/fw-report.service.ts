import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FwUploadFile } from '../../models/fw-upload-file/fw-upload-file';
import { map, catchError, tap } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { HelpersService } from '../helpers/helpers';
import { saveAs as importedSaveAs } from 'file-saver';
import { FwReport } from '../../models/fw-report/fw-report';

@Injectable()
export class FwReportService {

    apiUrl: string = environment.apiUrl;
    reportUrl: string = environment.reportUrl;
    constructor(
        private http: HttpClient,
        private helpers: HelpersService
        ) {
    }

    getReport(fileName: string, condition: object, fileType: string) {
        // const options = { responseType: 'blob' as 'json' };
        // return this.http.post<Blob>(this.apiUrl + '/api/report/export', obj, options);

        /* const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any>(this.reportUrl + '/rest_v2/reports/reports/' + path, httpOptions); */
        const param = this.helpers.formatParamsToString(condition, false);
        let path = fileName.concat('.', fileType) ;
        if (condition) {
            path = path.concat('?', param);
        }
        console.log('[path] => ', path);
        // window.location.href = this.reportUrl + path;
        window.open(this.reportUrl + path, '_blank');
    }

    getJasperReportFile(fileName): Observable<Blob> {
        const options = { responseType: 'blob' as 'json' };
        return this.http.post<Blob>(this.apiUrl + '/api/report/export/', fileName, options);
    }

    generateReport(report: FwReport) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(this.apiUrl + '/api/report/generateReport/', report, httpOptions);
    }

    getReport2(exportFilename): Observable<string> {
        const options = { responseType: 'text' as 'json' };
            // tslint:disable-next-line:max-line-length
            return this.http.get<any>('/jasperserver/rest_v2/reports/reports/inv1r010.html?ordermSerial=1', options);
            
            // .subscribe(
            //    res => {
                    // console.log('[res] => ', res);
                    // const temp = new Blob([res], {type: 'text/pdf'});
                    // console.log('start download:', temp);

                    // Success
                    /* console.log('start download:', temp);
                    const blob = new Blob([temp], { type: 'application/pdf' });
                    importedSaveAs(blob, exportFilename); */
                    // return new Blob([res], {type: 'text/plain'});

                    /* console.log('start download:', temp);
                    const url = window.URL.createObjectURL(temp);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = exportFilename;
                    a.click(); */
            //    }
            // );
            
            
            //.subscribe(
            //    res => {
            //        console.log('[res] => ', res);

                    /* // create link element
                    const a = document.createElement('a');
                    // tslint:disable-next-line:max-line-length
                    // const url = window.URL.createObjectURL('http://localhost:18080/jasperserver/rest_v2/reports/reports/inv1r010.pdf?ordermSerial=1');
                    const url = window.URL.createObjectURL(res);

                    // initialize
                    a.href = url;
                    a.download = exportFilename;

                    // append element to the body,
                    // a must, due to Firefox
                    document.body.appendChild(a);

                    // trigger download
                    a.click();

                    // delay a bit deletion of the element
                    setTimeout(function() {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }, 100); */
            //    }
            //);
            



        /* jquery.ajax({
            url: url,
            method: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                // create link element
                let a = document.createElement('a'), 
                    url = window.URL.createObjectURL(data);
    
                // initialize 
                a.href = url;
                a.download = filename;
    
                // append element to the body, 
                // a must, due to Firefox
                document.body.appendChild(a);
    
                // trigger download
                a.click();
    
                // delay a bit deletion of the element
                setTimeout(function(){
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
    
                // invoke callback if any 
                callbackSuccess(data);
            },
            error: function (err) {
                // invoke fail callback if any
                callbackFail(err)
            }
        } */


        /* const link = document.createElement('a');
                // tslint:disable-next-line:max-line-length
                link.href = 'data:text/pdf,http://localhost:18080/jasperserver/rest_v2/reports/reports/inv1r010.pdf?ordermSerial=1';
                link.target = '_blank';
                link.download = exportFilename;
                // link.setAttribute('header', 'Content-Disposition: filename="filetodownload.pdf"');
                // link.setAttribute('download', exportFilename);
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link); */


        /* const xhr = new XMLHttpRequest();
        xhr.open('GET', '/jasperserver/rest_v2/reports/reports/inv1r010.html?ordermSerial=1', true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          if (this.status === 200) {
            console.log('[res] => ', this.response);
            const myBlob = this.response;
            // myBlob is now the blob that the object URL pointed to.
            const csvData = new Blob([myBlob], {type: 'application/pdf;charset=utf-8;'});
            // IE11 & Edge
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(csvData, exportFilename);
            } else {
                // In FF link must be added to DOM to be clicked
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(csvData);
                link.setAttribute('download', exportFilename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
          }
        };
        xhr.send(); */


        /* fetch(this.reportUrl + '/inv1r010.html?ordermSerial=1').then(function(t) {
            return t.blob().then((b) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(b);
                a.setAttribute('download', exportFilename);
                a.click();
            }
            );
        }); */


        /* const httpOptions = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'false'
            })
        };


        return this.http.get<Blob>('/jasperserver/rest_v2/reports/reports/inv1r010.html?ordermSerial=1', httpOptions).subscribe(
            res => {
                console.log('[res] => ', res);
            }
        ); */
    }
}
