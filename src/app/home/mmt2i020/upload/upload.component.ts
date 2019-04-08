import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Router } from '@angular/router';
import { Mmt2i020Service } from '../services/mmt2i020.service';
import { FwLovService } from 'src/app/shared/services/fw-lov/fw-lov-service';
import { FwQueryUtilsService } from 'src/app/shared/services/fw-query-utils/fw-query-utils.service';
import { HelpersService } from 'src/app/shared/services/helpers/helpers';
import { FwMessageComponent } from 'src/app/shared/components/fw-message/fw-message.component';
import { Table } from 'primeng/table';
import { LogDshortImp } from 'src/app/shared/models/log-dshort-imp';
import { interval, Observable } from 'rxjs';
import { formatDDMMYYYYThaiDate } from 'src/app/shared/utils/format-ddmmyyyy-thai-date';
import { AutoComplete, FileUpload, LazyLoadEvent } from 'primeng/primeng';
import { catchError, tap } from 'rxjs/operators';
import { dateToStrYYYYMMDD } from 'src/app/shared/utils/date-to-string-yyyymmdd';
import { formatThaiDate } from 'src/app/shared/utils/format-thai-date';
import { LogDorderImp } from 'src/app/shared/models/log-dorder-imp';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadForm: FormGroup;
  loading: Boolean = false;
  uploading: Boolean = false;
  @ViewChild('tbUpload') table: Table;
  @ViewChild('fwMessage') fwMessage: FwMessageComponent;
  logDshortImpList: LogDshortImp[];
  logDorderImpSelectList: LogDshortImp[];
  offset = 0;
  limit = 100;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];
  maxDate = new Date();
  currentDate = formatDDMMYYYYThaiDate(new Date());
  currentTime = new Date();

  @ViewChild('lovTbSupplier') lovTbSupplier: AutoComplete;
  lovTbSupplierList: any[];
  lovTbSupplierSelectedList: any[];
  lovTbSupplierListById: any[];

  @ViewChild('lovTbConsignee') lovTbConsignee: AutoComplete;
  lovTbConsigneeList: any[];
  lovTbConsigneeSelectedList: any[];
  lovTbConsigneeListById: any[];

  @ViewChild('fileUpload') fileUpload: FileUpload;
  submitted: Boolean = false;
  isDuplicateFileUpload: Boolean = null;
  fileName: string;

  @ViewChild('tbUpload') tbUpload: Table;
  tbUploadList: any[];
  tbUploadSelectList: any[];
  searchBtnClick: Boolean = false;
  logDshortImps: LogDshortImp[];

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    public router: Router,
    private mmt2i020Service: Mmt2i020Service,
    private fwLovService: FwLovService,
    private fwQueryUtilsService: FwQueryUtilsService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.initBreadcrumb();
    this.initForm();
    this.cols = [
      { field: 'impSupCode', header: 'ผู้ส่งออก', style: {'text-align' : 'center'} },
      { field: 'impDateDesc', header: 'วันที่นำเข้าข้อมูล', style: {'text-align' : 'center'} },
      { field: 'cntFlagDesc', header: 'จำนวนรายการ สมบูรณ์/ไม่สมบูรณ์', style: {'text-align' : 'center'} },
      { field: 'impFilename', header: 'ชื่อไฟล์', style: {'text-align' : 'center', 'width' : '20%'} },
      { field: 'exportResult', header: 'Export รายงานผล', style: {'text-align' : 'center'} },
    ];
  }

  initBreadcrumb() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT2i020 : ข้อมูล SHORT การส่งสินค้า (ORDER)',
        routerLink: 'home/mmt2i020'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt2i020'
      },
      {
        label: 'นำเข้าข้อมูล',
        routerLink: 'home/mmt2i020/upload'
      }]);
  }

  initForm() {
    this.uploadForm = this.formBuilder.group({
      supCodeName: [null],
      currentDate: [null],
      currentTime: [null],
      tbSupplier: [null, Validators.required],
      tbConsignee: [null, Validators.required],
      invoiceNo: [null, Validators.required],
    });

    // Set current date & time
    this.uploadForm.get('currentDate').setValue(new Date());
    interval(1000).subscribe(() => {
      this.currentDate = formatDDMMYYYYThaiDate(new Date());
      this.currentTime = new Date();
    });

    this.fwLovService.getTbSupplier().subscribe(res => this.lovTbSupplierList = res);
    this.fwLovService.getTbConsignee().subscribe(res => this.lovTbConsigneeList = res);

    this.initialUploadFileComponent();
  }

  initialUploadFileComponent() {
    console.log(this.fileUpload);
    this.fileUpload.chooseLabel = 'เลือกไฟล์';
    this.fileUpload.uploadLabel = 'อัพโหลด';
    this.fileUpload.cancelLabel = 'ยกเลิก';
  }

  getLovTbSupplierList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getTbSupplier().subscribe(res => this.lovTbSupplierList = res);
    console.log('[lovList]', this.lovTbSupplierList);
    this.lovTbSupplierSelectedList = this.lovTbSupplierList;
    if (event.query) {
        this.lovTbSupplierSelectedList = this.lovTbSupplierList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovTbSupplierSelectedList);
        if (this.lovTbSupplierSelectedList.length === 0) {
          this.lovTbSupplier.onClear.emit();
        }
    }
  }

  lovTbSupplierSelectedById(event) {
    console.log('[id] : ', event.value);
    this.fwQueryUtilsService.getTbSupplierById(event.value)
    .pipe(
      tap(res => {
        this.lovTbSupplierListById = res[0];
        console.log('[TbSupplierById] : ', this.lovTbSupplierListById);

        // set null lov tbConsignee
        this.uploadForm.get('tbConsignee').setValue(null);

        // set lov mLayoutVers
        /* if (this.lovTbSupplierListById['suplayoutVers']) {
          this.uploadForm.get('mLayoutVers').patchValue({
            'label' : this.lovTbSupplierListById['layoutName'],
            'value' : this.lovTbSupplierListById['suplayoutVers']
          });
        } else {
          this.uploadForm.get('mLayoutVers').setValue(null);
        } */

      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('[catchError] : ', err);
          })
      )
    ).subscribe();
  }

  getLovTbConsigneeList(event) {
    this.fwLovService.getTbConsignee().subscribe(res => this.lovTbConsigneeList = res);
    if (this.uploadForm.get('tbSupplier').value) {
      const supSerial = this.uploadForm.get('tbSupplier').value['value'];
      this.lovTbConsigneeSelectedList = this.lovTbConsigneeList.filter(obj => obj.supSerial === supSerial);
    } else {
      this.lovTbConsigneeSelectedList = this.lovTbConsigneeList;
    }
    if (event.query) {
      this.lovTbConsigneeSelectedList = this.lovTbConsigneeList.filter(obj => obj.label.indexOf(event.query) !== -1);
      if (this.lovTbConsigneeSelectedList.length === 0) {
        this.lovTbConsignee.onClear.emit();
      }
    }
  }

  onBeforeSend(event) {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      this.fwMessage.messageWarning('กรุณาระบุข้อมูลดังกล่าว');
      return false;
    } else {
      console.log('[onBeforeSend] : ', this.uploadForm.value);
      console.log('[isDuplicateFileUpload] : ', this.isDuplicateFileUpload);
      if (this.isDuplicateFileUpload) {
        this.fwMessage.messageWarning('ไฟล์นี้ถูกอัพโหลดไปแล้ว');
        return false;
      } else {
        const token = JSON.parse(localStorage.getItem('currentUser')).token;
        const uploadDate = new Date();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const createBy = currentUser.userInfo.userId;

        const supCode = this.uploadForm.get('tbSupplier').value ? this.uploadForm.get('tbSupplier').value['supCode'] : null;
        const supSerial = this.uploadForm.get('tbSupplier').value ? this.uploadForm.get('tbSupplier').value['value'] : null;
        const impByrSerial = this.uploadForm.get('tbConsignee').value ? this.uploadForm.get('tbConsignee').value['byrSerial'] : null;
        const invoiceNo = this.uploadForm.get('invoiceNo').value
          ? this.uploadForm.get('invoiceNo').value : null;

        const fileNameModify = supCode + '_Order' + '_' + dateToStrYYYYMMDD(this.uploadForm.get('currentDate').value) + '_01' + '.xlsx';
        // if (fileNameModify === this.fileName) {
        if (true) {
          event.formData.append('uploadDate', dateToStrYYYYMMDD(uploadDate));
          event.formData.append('supCode', supCode);
          event.formData.append('supSerial', supSerial);
          event.formData.append('impByrSerial', impByrSerial);
          event.formData.append('invoiceNo', invoiceNo);
          event.formData.append('createBy', createBy);
          event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          this.uploading = true;
        } else {
          this.fwMessage.messageWarning('รูปแบบของไฟล์ไม่ถูกต้อง');
        }
      }
    }
    return true;
  }

  onSelect(event) {
    const fileName = event.files[0].name;
    this.fileName = fileName;
    this.checkDuplicateFileBeforeUpload();
  }

  checkDuplicateFileBeforeUpload() {
    console.log('checkDuplicateFileBeforeUpload...', this.fileName);
    let payload: LogDorderImp = this.helpers.copy(this.uploadForm.getRawValue(), new LogDorderImp);
    const offset = 0;
    const limit = 100;
    const impFilename = this.fileName;
    payload = this.helpers.append({}, { offset, limit, impFilename });

    console.log('[payload] : ', payload);
    this.mmt2i020Service
      .getLogDshortImp(payload)
      .pipe(
        tap(res => {
          console.log('[res] : ', res);
            if (res.length > 0) {
                this.isDuplicateFileUpload = true;
            } else {
                this.isDuplicateFileUpload = false;
            }
            console.log('[Is duplicate file] : ', this.isDuplicateFileUpload);
        }), catchError(
          err =>
            new Observable(() => {
              console.log('catchError--->', err);
            })
        )
      ).subscribe();
  }

  onBeforeUpload(event) {
  }

  onUpload(event) {
    console.log('test');
    if (event.xhr.status === 200) {
      this.uploadForm.get('currentDate').setValue(new Date());
      this.uploading = false;
      this.fwMessage.messageSuccess('อัพโหลดสำเร็จ');
    } else {
      this.uploading = false;
      this.fwMessage.messageError('อัพโหลดไม่สำเร็จ');
    }
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.searchLogDshortImp(offset, limit, false);
    }
  }

  private searchLogDshortImp(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: LogDshortImp = this.helpers.copy(this.uploadForm.getRawValue(), new LogDshortImp);
    const impSupCode = this.helpers.getValueFromAbstractControl(this.uploadForm.get('tbSupplier').value, 'supCode');
    const impDateFormat = dateToStrYYYYMMDD(this.uploadForm.get('currentDate').value);
    const invoiceNo = this.uploadForm.get('invoiceNo').value;
    payload = this.helpers.append({}, { offset, limit, impSupCode, impDateFormat ,invoiceNo});
    console.log('[payload] : ', payload);
    this.mmt2i020Service
      .getLogDshortImp(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          // this.tbUploadList = res
          this.logDshortImps = res;
          this.logDshortImps.forEach(value => {
            value.impDateDesc = (value.impDate != null ? formatThaiDate(value.impDate) : null);
            value.cntFlagDesc =
              (value.cntComplete != null ? value.cntComplete.toString() : '0')
              + '/' + (value.cntError != null ? value.cntError.toString() : '0');
          });
          this.tbUploadList = this.logDshortImps;
          if (onClickSearch) {
            this.totalRecords = this.tbUploadList.length;
          }
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err);
              this.loading = false;
              this.fwMessage.messageError('ไม่สามารถค้นหาได้');
            })
        )
      ).subscribe();
  }

  onSearchInvDshortImp() {
    const offset = 0;
    const limit = 100;
    this.searchLogDshortImp(offset, limit, true);
    this.update(this.table);
    this.tbUploadSelectList = [];
  }
  update(table) {
    table.reset();
  }
}
