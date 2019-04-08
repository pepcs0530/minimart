import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i040Service } from 'src/app/_services/mmt1i040.service';
import { LogProductImp } from '../../models/logProductImp';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { Mmt1i040SearchComponent } from '../search/search.component';
import {FileUploadModule} from 'primeng/fileupload';

@Component({
    selector: 'mmt1i040-upload',
    templateUrl: 'upload.component.html',
    styleUrls: ['../mmt1i040.component.css']
})
export class Mmt1i040UploadComponent extends FactoryService implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    @ViewChild('tb') table: Table;

    saveForm: FormGroup;
    prouseTypeList: any[];
    proauthpplTypeList: any[];
    prodeliveryTagList: any[];
    prouseFlagList: any[];
    prolayoutVersList: any[];
    proreleasePortList: any[];
    procargoPortList: any[];
    proProvinceList: any[];
    proprodTypeList: any[];
    uploadedFiles: any[];
    lableTextField: string;
    LogProductImps: LogProductImp[];
    mode: string;
    visibleDialog: Boolean = false;
    tabIndex: number = 0;
    submitted: Boolean = false;
    cols: any[];
    validate: number = 0;
    fileName: string;
    supauthpplTypeList: any[];
    supSerialThList: any[];
    supSerialThList2: any[];
    totalRecords: number;
    searchBtnClick: Boolean = false;
    tbUploadList: any[];
    tbUploadSelectList: any[];

    isDuplicateFileUpload: Boolean = null;



    @ViewChild('proCode') proCode: ElementRef;

    // private buyerFromSearch: LogProductImp;
    constructor(private formBuilder: FormBuilder, private mmt1i040Service: Mmt1i040Service) {
        super();
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            uploadDate: [null, Validators.required],
            supSerial: [null, Validators.required],
          
            
        });

        this.cols = [
            { field: 'impSerial', header: 'ลำดับที่' },
            { field: 'impSupCode', header: 'รหัสผู้ส่งออก' },
      
            { field: 'impDateDesc', header: 'วันที่นำเข้าข้อมูล' },
            { field: 'cntFlagDesc', header: 'จำนวนรายการ สมบูรณ์/ไม่สมบูรณ์' },
            { field: 'impFilename', header: 'ชื่อไฟล์ฺ' },
            { field: 'link', header: 'Exportรายงานผล' },
          ];
        // this.mmt1i040Service.getMProvince().subscribe(res => this.proProvinceList = res);
        // this.mmt1i040Service.getMSupuseList().subscribe(res => this.prouseTypeList = res);
        // this.mmt1i040Service.getMDeliveryTagList().subscribe(res => this.prodeliveryTagList = res);
        // this.mmt1i040Service.getMProdTypeList().subscribe(res => this.proprodTypeList = res);
        // this.mmt1i040Service.getMUseFlagList().subscribe(res => this.prouseFlagList = res);

      //  alert('addfd');
        this.mmt1i040Service.getSupSerialThSubCodeList().subscribe(res =>this.supSerialThList = res);
        console.log('===supSerialThList==>',this.supSerialThList);
    }

    onOpenUploadComponent(jsonObj) {       
        this.tabIndex = 0;
        // this.buyerFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.cancelForm();
    }

    handleChange(e) {
        this.tabIndex = e.index;
    }

    onUpload(event) {
        console.log('event===>', event);
        console.log('responseText===>', event.xhr.responseText);
        if (event.xhr.responseText === 'success') {
            this.fwMsg.messageSuccess('บันทึกสำเร็จ');
        } else {
            this.fwMsg.messageError('บันทึกไม่สำเร็จ');
        }
    }

    onBeforeSend(event) {
            this.submitted = true;
            if (this.saveForm.invalid) {
                return false;
            } else {
                console.log('this.isDuplicateFileUpload-->', this.isDuplicateFileUpload);
                if (this.isDuplicateFileUpload) {
                    // alert('ไฟล์ซ้ำ');
                    this.fwMsg.messageWarning('ไฟล์นี้ถูกอัพโหลดไปแล้ว');
                } else {
                    // alert('อัพโหลด...');
                    const token = JSON.parse(localStorage.getItem('currentUser')).token;
                    const uploadDate = new Date(this.saveForm.get('uploadDate').value);
                    const subCode = this.saveForm.value.supSerial['value'];
                    const subSerial = this.saveForm.value.supSerial['hidden'];
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    const createBy = currentUser.userInfo.userId;
                    // const fileNameModify = 'PN01_' + subCode + '_' + this.dateToStrYYYYMMDD(uploadDate) + '_001' + '.xlsx';
                    const fileNameModify = subCode + '_PartNo' + '_' + this.dateToStrYYYYMMDD(uploadDate) + '_001' + '.xlsx';
                    if (fileNameModify === this.fileName) {


                        event.formData.append('uploadDate', this.dateToStrYYYYMMDD(uploadDate));
                        event.formData.append('subCode', subCode);
                        event.formData.append('subSerial', subSerial);
                        event.formData.append('createBy', createBy);
                    //    event.xhr.set

                        event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    } else {
                        this.fwMsg.messageWarning('รูปแบบของไฟล์ไม่ถูกต้อง');
                    }
                }

                /*const token = JSON.parse(localStorage.getItem('currentUser')).token;
                const uploadDate = new Date(this.saveForm.get('uploadDate').value);
                const subCode = this.saveForm.value.supSerial['value'];
                const subSerial = this.saveForm.value.supSerial['hidden'];
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const createBy = currentUser.userInfo.userId;
                // const fileNameModify = 'PN01_' + subCode + '_' + this.dateToStrYYYYMMDD(uploadDate) + '_001' + '.xlsx';
                const fileNameModify = subCode + '_PartNo' + '_' + this.dateToStrYYYYMMDD(uploadDate) + '_001' + '.xlsx';
                if (fileNameModify === this.fileName) {


                    event.formData.append('uploadDate', this.dateToStrYYYYMMDD(uploadDate));
                    event.formData.append('subCode', subCode);
                    event.formData.append('subSerial', subSerial);
                    event.formData.append('createBy', createBy);
                //    event.xhr.set

                    event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                } else {
                    this.fwMsg.messageWarning('รูปแบบของไฟล์ไม่ถูกต้อง');
                }*/
            }

    }

    private searchLogProductImp(offset: number, limit: number, onClickSearch: boolean) {
        this.searchBtnClick = true;
        this.loading = true;
        let payload: LogProductImp = this.fwMsg.copy(this.saveForm.getRawValue(), new LogProductImp);
       
        const impSupCode = this.saveForm.get('supSerial').value ? this.saveForm.value.supSerial['value'] : null;
        const impDateFormat = this.dateToStrYYYYMMDD(this.saveForm.get('uploadDate').value);
        payload = this.fwMsg.append(payload, { offset, limit, impSupCode, impDateFormat });
       
        console.log('payload-->', payload);
        // payload = this.fwMsg.append(payload, { offset, limit });
        this.mmt1i040Service
          .getLogProductImp(payload)
          .pipe(
            tap(res => {
              this.loading = false;
            //   this.tbUploadList = res
            this.LogProductImps = res;
            this.LogProductImps.forEach(value => {
                value.impDateDesc = (value.impDate != null ? this.dateThaiFormat(value.impDate): null);
                value.cntFlagDesc = (value.cntComplete != null ? value.cntComplete.toString(): '0')+'/'+(value.cntError != null ? value.cntError.toString(): '0');
            });
            this.tbUploadList = this.LogProductImps;
              if (onClickSearch) {
                this.totalRecords = this.tbUploadList.length;
              }
            }
            ), catchError(
              err =>
                new Observable(() => {
                  console.log('catchError--->', err);
                  this.loading = false;
                  this.fwMsg.messageError('ไม่สามารถค้นหาได้');
                })
            )
          ).subscribe();
      }

      loadCarsLazy(event: LazyLoadEvent) {
        if (this.searchBtnClick) {
          const offset = event.first;
          const limit = event.rows;
          this.searchLogProductImp(offset, limit, false);
        }
      }

    onSearchProduct() {
        // this.submitted = true;
        // if (this.saveForm.invalid) {
        //    return true;
        // } else {
            const offset = 0;
            const limit = 100;
            this.searchLogProductImp(offset, limit, true);
            this.update(this.table);
            this.tbUploadSelectList = [];
        // }
    }

    update(table) {
        table.reset();
    }

    onBeforeUploadIncome(event) {

        /*
        .pipe(
            tap(res => {
                console.log('res--->', res);
                if (res.length > 0) {
                    console.log('true--->', res.length);
                    // this.fwMsg.messageWarning('ไฟล์นี้ถูกอัพโหลดไปแล้ว');
                    this.isDuplicateFileUpload = true;
                    // return false;
                } else {
                    console.log('false--->', res.length);
                    this.isDuplicateFileUpload = false;
                    // return true;
                }
            }), catchError(
            err =>
                new Observable(() => {
                console.log('catchError--->', err);
                })
            )
        ).subscribe({
            next: (res) => {
                console.log('received response', res);
              },
              error: err => {
                console.log('error occurred');
              },
              complete: () => {
                console.log('subscription completed');
              },
        });
        */
    }

    onSelect(event) {
        const fileName = event.files[0].name;
        this.fileName = fileName;
        this.checkDuplicateFileBeforeUpload();
        console.log('Is duplicate file : ', this.isDuplicateFileUpload);
    }

    setBeanToForm(tbProduct: LogProductImp) {
        // this.saveForm.get('proSerial').setValue(tbProduct.proSerial);
        // this.saveForm.get('proAddr1').setValue(tbProduct.proAddr1);
        // this.saveForm.get('proAddr1Th').setValue(tbProduct.proAddr1Th);
        // this.saveForm.get('proAmphur').setValue(tbProduct.proAmphur);
        // this.saveForm.get('proAmphurTh').setValue(tbProduct.proAmphurTh);
        // this.saveForm.get('proCode').setValue(tbProduct.proCode);
        // this.saveForm.get('proFax').setValue(tbProduct.proFax);
        // this.saveForm.get('proMobile').setValue(tbProduct.proMobile);
        // this.saveForm.get('proNameEng').setValue(tbProduct.proNameEng);
        // this.saveForm.get('proNameTh').setValue(tbProduct.proNameTh);
        // this.saveForm.get('proPhone').setValue(tbProduct.proPhone);
        // this.saveForm.get('proPostcode').setValue(tbProduct.proPostcode);
        // this.saveForm.get('proPplno').setValue(tbProduct.proPplno);
        // this.saveForm.get('proProvinceId').setValue(tbProduct.proProvinceId);
        // this.saveForm.get('proTumbon').setValue(tbProduct.proTumbon);
        // this.saveForm.get('proTumbonTh').setValue(tbProduct.proTumbonTh);
        // this.saveForm.get('proauthpplType').setValue(tbProduct.proauthpplType);
        // this.saveForm.get('probranchCode').setValue(tbProduct.probranchCode);
        // this.saveForm.get('probranchName').setValue(tbProduct.probranchName);
        // this.saveForm.get('procargoPort').setValue(tbProduct.procargoPort);
        // this.saveForm.get('prodeliveryTag').setValue(tbProduct.prodeliveryTag);
        // this.saveForm.get('prolayoutVers').setValue(tbProduct.prolayoutVers);
        // this.saveForm.get('proplantCode').setValue(tbProduct.proplantCode);
        // this.saveForm.get('proprodType').setValue(tbProduct.proprodType);
        // this.saveForm.get('proregisBoi19').setValue(tbProduct.proregisBoi19);
        // this.saveForm.get('proregisBoippl').setValue(tbProduct.proregisBoippl);
        // this.saveForm.get('proregisN019').setValue(tbProduct.proregisN019);
        // this.saveForm.get('proreleasePort').setValue(tbProduct.proreleasePort);
        // this.saveForm.get('prostsFlag').setValue(tbProduct.prostsFlag);
        // this.saveForm.get('protaxId').setValue(tbProduct.protaxId);
        // this.saveForm.get('protaxIncentive').setValue(tbProduct.protaxIncentive);
        // this.saveForm.get('prouseFlag').setValue(tbProduct.prouseFlag);
        // this.saveForm.get('prouseType').setValue(tbProduct.prouseType);
    }

    // onShow() {
    //     this.proCode.nativeElement.focus();
    // }

    // tbProductSave() {
    //     this.submitted = true;
    //     if (!this.saveForm.invalid) {
    //         let payload: LogProductImp = this.fwMsg.copy(this.saveForm.getRawValue(), new LogProductImp);
    //         if (this.mode == 'add') {
    //             this.mmt1i040Service.addLogProductImp(payload).pipe(tap(res => {
    //                 this.mode = 'edit';
    //                 // this.saveForm.get('byrSerial').setValue(res.proSerial);
    //                 this.onSaveSuccess.emit('success')
    //                 this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
    //             }), catchError(err => new Observable(() => {
    //                 console.log('catchError--->', err.data);
    //                 this.fwMsg.messageError('ไม่สามารถบันทึกได้');
    //             }))).subscribe();
    //         } else {
    //             this.mmt1i040Service.editLogProductImp(payload).pipe(tap(res => {
    //                 this.onSaveSuccess.emit('success')
    //                 this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
    //             }), catchError(err => new Observable(() => {
    //                 console.log('catchError--->', err.data);
    //                 this.fwMsg.messageError('ไม่สามารถบันทึกได้');
    //             }))).subscribe();
    //         }
    //     }
    // }

    cancelForm() {
        this.submitted = false;
        this.saveForm.reset();
        // if (this.mode == 'add') {
        //     this.saveForm.reset();
        //     this.lableTextField = 'เพิ่มรายละเอียดผู้ซื้อ';
        // } else {
        //     this.lableTextField = 'แก้ไขรายละเอียดผู้ซื้อ'
        //     this.setBeanToForm(this.buyerFromSearch);
        // }
    }

    validateNumber($event , form, id , precision, scale) {
        this.fwMsg.validateNumberField($event , form , id, precision, scale);
    }

    getLableSupregis(){
        let text:string;
        this.prouseTypeList.forEach(value => {
            if(this.saveForm.controls.prouseType.value == value.prouseType){
                text = value.prouseLabel1;
            }
        });
        return text;
    }

    checkSelectSupuseType(prouseType:string){
        if(this.saveForm.controls.prouseType.value != null){
            if(this.saveForm.controls.prouseType.value == prouseType){
                return true;
            }
        }
        return false;
    }

    dateToStrYYYYMMDD(input: Date): string {
        const padNumber = num => (num > 9 ? num : `0${num}`);
      if (input) {
        const d = input instanceof Date ? input : new Date(input);
        /*  return `${padNumber(d.getDate())}/${padNumber(
          d.getMonth() + 1
        )}/${d.getFullYear()}`; */
        return `${d.getFullYear()}${padNumber(d.getMonth() + 1)}${padNumber(
          d.getDate()
        )}`;
      } else {
        return null;
      }
    }

    dateThaiFormat(input: Date): string {
        const padNumber = num => (num > 9 ? num : `0${num}`);
        const thmonth = new Array("ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.",
		"มิ.ย.", "ก.ค.","ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.",
		"ธ.ค.");
      if (input) {
        const d = input instanceof Date ? input : new Date(input);
        return `${padNumber(
            d.getDate())} ${thmonth[d.getMonth()]} ${d.getFullYear()+543}`;
      } else {
        return null;
      }
    }

    getSupSerialThSubCodeList(event) {
        console.log('event-->', event.query);
        this.mmt1i040Service.getSupSerialThSubCodeList().subscribe(res => this.supSerialThList = res);
        console.log('supSerialThList-->', this.supSerialThList);
        this.supSerialThList2 = this.supSerialThList;
        if (event.query) {
            this.supSerialThList2 = this.supSerialThList.filter(obj => obj.label === event.query);
            console.log('supSerialThList filter-->', this.supSerialThList2);
        }
        
    }

    checkDuplicateFileBeforeUpload() {
        console.log('checkDuplicateFileBeforeUpload...');
        let payload: LogProductImp = this.fwMsg.copy(this.saveForm.getRawValue(), new LogProductImp);
        const impSupCode = this.saveForm.get('supSerial').value ? this.saveForm.value.supSerial['value'] : null;
        const impDateFormat = this.dateToStrYYYYMMDD(this.saveForm.get('uploadDate').value);
        const offset = 0;
        const limit = 100;
        payload = this.fwMsg.append(payload, { offset, limit, impSupCode, impDateFormat });
        console.log('payload-->', payload);
        this.mmt1i040Service
          .getLogProductImp(payload)
          .pipe(
            tap(res => {
                // console.log('res--->', res);
                if (res.length > 0) {
                    // console.log('true--->', res.length);
                    // return true;
                    this.isDuplicateFileUpload = true;
                } else {
                    // console.log('false--->', res.length);
                    // return false;
                    this.isDuplicateFileUpload = false;
                }
            }), catchError(
              err =>
                new Observable(() => {
                  console.log('catchError--->', err);
                })
            )
          ).subscribe();

        /*const promise = new Promise((resolve, reject) => {
        this.mmt1i040Service
          .getLogProductImp(payload).toPromise()
          .then(
            res => { // Success
                if (res.length > 0) {
                    console.log('true--->', res.length);
                    this.isDuplicateFileUpload = true;
                } else {
                    console.log('false--->', res.length);
                    this.isDuplicateFileUpload = false;
                }
                resolve();
            },
            msg => { // Error
                // this.isDuplicateFileUpload = false;
                reject(msg);
            }
          );
        });
        return promise;*/
    }

    get f() {
        return this.saveForm.controls;
    }


}
