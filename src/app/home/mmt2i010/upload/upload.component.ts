import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { LogDorderImp } from 'src/app/shared/models/log-dorder-imp';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Router } from '@angular/router';
import { Mmt2i010Service } from '../services/mmt2i010.service';
import { HelpersService } from '@libs/helpers/helpers';
import { FwMessageComponent } from 'src/app/shared/components/fw-message/fw-message.component';
import { dateToStrYYYYMMDD } from 'src/app/shared/utils/date-to-string-yyyymmdd';
import { LazyLoadEvent } from 'primeng/api';
import { tap, catchError, map } from 'rxjs/operators';
import { formatThaiDate } from 'src/app/shared/utils/format-thai-date';
import { Observable, interval } from 'rxjs';
import { FwLovService } from 'src/app/shared/services/fw-lov/fw-lov-service';
import { AutoComplete, FileUpload } from 'primeng/primeng';
import { formatDDMMYYYYThaiDate } from 'src/app/shared/utils/format-ddmmyyyy-thai-date';
import { formatHHMMThaiTime } from 'src/app/shared/utils/format-hhmm-thai-time';
import { FwQueryUtilsService } from 'src/app/shared/services/fw-query-utils/fw-query-utils.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadForm: FormGroup;
  loading: Boolean = false;
  uploading: Boolean = false;
  @ViewChild('tb') table: Table;
  @ViewChild('fwMessage') fwMessage: FwMessageComponent;
  logDorderImpList: LogDorderImp[];
  logDorderImpSelectList: LogDorderImp[];
  offset = 0;
  limit = 100;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];
  maxDate = new Date();

  currentDate = formatDDMMYYYYThaiDate(new Date());
  // currentTime = formatHHMMThaiTime(new Date());
  currentTime = new Date();

  @ViewChild('lovTbSupplier') lovTbSupplier: AutoComplete;
  lovTbSupplierList: any[];
  lovTbSupplierSelectedList: any[];
  lovTbSupplierListById: any[];

  @ViewChild('lovTbConsignee') lovTbConsignee: AutoComplete;
  lovTbConsigneeList: any[];
  lovTbConsigneeSelectedList: any[];
  lovTbConsigneeListById: any[];

  @ViewChild('lovMLayoutVers') lovMLayoutVers: AutoComplete;
  lovMLayoutVersList: any[];
  lovMLayoutVersSelectedList: any[];

  @ViewChild('lovMTranFz') lovMTranFz: AutoComplete;
  lovMTranFzList: any[];
  lovMTranFzSelectedList: any[];

  @ViewChild('lovMAreaPort') lovMAreaPort: AutoComplete;
  lovMAreaPortList: any[];
  lovMAreaPortSelectedList: any[];

  @ViewChild('lovSupreleasePort') lovSupreleasePort: AutoComplete;
  lovSupreleasePortList: any[];
  lovSupreleasePortSelectedList: any[];

  @ViewChild('lovSupcargoPort') lovSupcargoPort: AutoComplete;
  lovSupcargoPortList: any[];
  lovSupcargoPortSelectedList: any[];

  @ViewChild('lovMCountry') lovMCountry: AutoComplete;
  lovMCountryList: any[];
  lovMCountrySelectedList: any[];

  @ViewChild('lovMMoney') lovMMoney: AutoComplete;
  lovMMoneyList: any[];
  lovMMoneySelectedList: any[];

  @ViewChild('fileUpload') fileUpload: FileUpload;
  submitted: Boolean = false;
  isDuplicateFileUpload: Boolean = null;
  fileName: string;

  searchBtnClick: Boolean = false;
  tbUploadList: any[];
  tbUploadSelectList: any[];
  logDorderImps: LogDorderImp[];

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    public router: Router,
    private mmt2i010Service: Mmt2i010Service,
    private fwLovService: FwLovService,
    private fwQueryUtilsService: FwQueryUtilsService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT2I010 : ข้อมูลการสั่งสินค้า (ORDER)',
        routerLink: 'home/mmt2i010'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt2i010'
      },
      {
          label: 'นำเข้าข้อมูล',
          routerLink: 'home/mmt2i010/upload'
    }]);

    this.uploadForm = this.formBuilder.group({
      supCodeName: [null],
      currentDate: [null],
      currentTime: [null],
      tbSupplier: [null, Validators.required],
      tbConsignee: [null],
      suplayoutVer: [null],
      mLayoutVers: [null],
      mTranFz: [null],
      supreleasePort: [null],
      supcargoPort: [null, Validators.required],
      mCountry: [null, Validators.required],
      mMoney: [null, Validators.required],
      supplantCode: [null, Validators.required],
      impFilename: [null],
      orderStatus: [null]
    });

    this.cols = [
      /* { field: 'impSerial', header: 'ลำดับ', style: {'text-align' : 'center'} }, */
      { field: 'impSupCode', header: 'รหัสผู้ส่งออก', style: {'text-align' : 'center'} },
      { field: 'impDateDesc', header: 'วันที่นำเข้าข้อมูล', style: {'text-align' : 'center'} },
      { field: 'cntFlagDesc', header: 'จำนวนรายการ สมบูรณ์/ไม่สมบูรณ์', style: {'text-align' : 'center'} },
      { field: 'impFilename', header: 'ชื่อไฟล์', style: {'text-align' : 'center', 'width' : '20%'} },
      { field: 'exportResult', header: 'Export รายงานผล', style: {'text-align' : 'center'} },
    ];

    // Set current date & time
    this.uploadForm.get('currentDate').setValue(new Date());
    interval(1000).subscribe(() => {
      this.currentDate = formatDDMMYYYYThaiDate(new Date());
      this.currentTime = new Date();
    } );

    this.fwLovService.getTbSupplier().subscribe(res => this.lovTbSupplierList = res);
    this.fwLovService.getTbConsignee().subscribe(res => this.lovTbConsigneeList = res);
    this.fwLovService.getMLayoutVers().subscribe(res => this.lovMLayoutVersList = res);
    this.fwLovService.getMTranFz().subscribe(res => this.lovMTranFzList = res);
    this.fwLovService.getMAreaPort().subscribe(res => {
      this.lovMAreaPortList = res;
      this.lovSupreleasePortList = res;
      this.lovSupcargoPortList = res;
    });
    this.fwLovService.getMCountry().subscribe(res => this.lovMCountryList = res);
    this.fwLovService.getMMoney().subscribe(res => this.lovMMoneyList = res);

    this.initialUploadFileComponent();
  }

  initialUploadFileComponent() {
    console.log(this.fileUpload);
    this.fileUpload.chooseLabel = 'เลือกไฟล์';
    this.fileUpload.uploadLabel = 'อัพโหลด';
    this.fileUpload.cancelLabel = 'ยกเลิก';
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.searchLogDorderImp(offset, limit, false);
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
            // alert('ไฟล์ซ้ำ');
            this.fwMessage.messageWarning('ไฟล์นี้ถูกอัพโหลดไปแล้ว');
        } else {
            const token = JSON.parse(localStorage.getItem('currentUser')).token;
            const uploadDate = new Date();
            // const subCode = this.saveForm.value.supSerial['value'];
            // const subSerial = this.saveForm.value.supSerial['hidden'];
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const createBy = currentUser.userInfo.userId;

            const supCode = this.uploadForm.get('tbSupplier').value ? this.uploadForm.get('tbSupplier').value['supCode'] : null;
            const supSerial = this.uploadForm.get('tbSupplier').value ? this.uploadForm.get('tbSupplier').value['value'] : null;
            const impByrSerial = this.uploadForm.get('tbConsignee').value ? this.uploadForm.get('tbConsignee').value['byrSerial'] : null;
            const suplayoutVers = this.uploadForm.get('mLayoutVers').value ? this.uploadForm.get('mLayoutVers').value['value'] : null;
            const tranFreezone = this.uploadForm.get('mTranFz').value ? this.uploadForm.get('mTranFz').value['value'] : null;
            const supreleasePort = this.uploadForm.get('supreleasePort').value
              ? this.uploadForm.get('supreleasePort').value['value'] : null;
            const supcargoPort = this.uploadForm.get('supcargoPort').value
              ? this.uploadForm.get('supcargoPort').value['value'] : null;
            const countryId = this.uploadForm.get('mCountry').value
              ? this.uploadForm.get('mCountry').value['value'] : null;
            const moneyId = this.uploadForm.get('mMoney').value
              ? this.uploadForm.get('mMoney').value['value'] : null;
            const supplantCode = this.uploadForm.get('supplantCode').value
              ? this.uploadForm.get('supplantCode').value : null;

            // const fileNameModify = 'PN01_' + subCode + '_' + this.dateToStrYYYYMMDD(uploadDate) + '_001' + '.xlsx';
            const fileNameModify = supCode + '_Order' + '_' + dateToStrYYYYMMDD(this.uploadForm.get('currentDate').value) + '_01' + '.xlsx';
            // const fileNameModify = 'NIT1' + '_Order' + '_' + dateToStrYYYYMMDD(uploadDate) + '_01' + '.xlsx';
            if (fileNameModify === this.fileName) {
            // if (true) {
                event.formData.append('uploadDate', dateToStrYYYYMMDD(uploadDate));
                event.formData.append('supCode', supCode);
                event.formData.append('supSerial', supSerial);
                event.formData.append('startDate', new Date().getTime());
                event.formData.append('endDate', new Date().getTime());
                event.formData.append('impByrSerial', impByrSerial);
                event.formData.append('suplayoutVers', suplayoutVers);
                event.formData.append('tranFreezone', tranFreezone);
                event.formData.append('supreleasePort', supreleasePort);
                event.formData.append('supcargoPort', supcargoPort);
                event.formData.append('countryId', countryId);
                event.formData.append('moneyId', moneyId);
                event.formData.append('supplantCode', supplantCode);
                event.formData.append('createBy', createBy);
                event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                this.uploading = true;
            } else {
                this.fwMessage.messageWarning('รูปแบบของไฟล์ไม่ถูกต้อง');
            }
        }
    }
  }

  onSelect(event) {
    const fileName = event.files[0].name;
    this.fileName = fileName;
    this.checkDuplicateFileBeforeUpload();
    // console.log('[Is duplicate file] : ', this.isDuplicateFileUpload);
  }

  checkDuplicateFileBeforeUpload() {
    console.log('checkDuplicateFileBeforeUpload...', this.fileName);
    let payload: LogDorderImp = this.helpers.copy(this.uploadForm.getRawValue(), new LogDorderImp);
    const offset = 0;
    const limit = 100;
    const impFilename = this.fileName;
    payload = this.helpers.append({}, { offset, limit, impFilename });

    console.log('[payload] : ', payload);
    this.mmt2i010Service
      .getLogDorderImp(payload)
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
    /* console.log('checkDuplicateFileBeforeUpload...');
    const offset = 0;
    const limit = 100;
    let payload: LogPricecfImp = this.fwMsg.copy(this.saveForm.getRawValue(), new LogPricecfImp);

    const impSupCode = this.saveForm.get('supSerial').value ? this.saveForm.value.supSerial['value'] : null;
    const impDateFormat = this.dateToStrYYYYMMDD(this.saveForm.get('uploadDate').value);
    payload = this.fwMsg.append(payload, { offset, limit, impSupCode, impDateFormat });

    console.log('payload-->', payload);

    // payload = this.fwMsg.append(payload, { offset, limit });
    this.mmt1i050Service
      .getLogPricecfImp(payload)
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
      ).subscribe(); */
  }

  onBeforeUploadIncome(event) {
  }

  onUpload(event) {
    console.log('[event] : ', event);
    console.log('[responseStatus] : ', event.xhr.status);
    if (event.xhr.status === 200) {
      this.uploading = false;
      this.uploadForm.get('currentDate').setValue(new Date());
      this.fwMessage.messageSuccess('อัพโหลดสำเร็จ');
    } else {
      this.uploading = false;
      this.fwMessage.messageError('อัพโหลดไม่สำเร็จ');
    }
  }

  onSearchInvDorderImp() {
    const offset = 0;
    const limit = 100;
    this.searchLogDorderImp(offset, limit, true);
    this.update(this.table);
    this.tbUploadSelectList = [];
  }

  private searchLogDorderImp(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: LogDorderImp = this.helpers.copy(this.uploadForm.getRawValue(), new LogDorderImp);

    /* const impSupCode = this.uploadForm.get('tbSupplier').value
      ? this.uploadForm.get('tbSupplier').value['supCode'] : null;
    const impDateFormat = dateToStrYYYYMMDD(this.uploadForm.get('currentDate').value); */

    const impSupCode = this.helpers.getValueFromAbstractControl(this.uploadForm.get('tbSupplier').value, 'supCode');
    const impDateFormat = dateToStrYYYYMMDD(this.uploadForm.get('currentDate').value);

    payload = this.helpers.append({}, { offset, limit, impSupCode, impDateFormat });

    // this.helpers.getValueFromAbstractControl(this.uploadForm.get('tbSupplier').value, 'value');
    // this.helpers.getValueFromAbstractControl(this.uploadForm.get('supplantCode').value, 'value');

    console.log('[payload] : ', payload);
    // payload = this.helpers.append(payload, { offset, limit });
    this.mmt2i010Service
      .getLogDorderImp(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          // this.tbUploadList = res
          this.logDorderImps = res;
          this.logDorderImps.forEach(value => {
            value.impDateDesc = (value.impDate != null ? formatThaiDate(value.impDate) : null);
            value.cntFlagDesc =
              (value.cntComplete != null ? value.cntComplete.toString() : '0')
              + '/' + (value.cntError != null ? value.cntError.toString() : '0');
          });
          this.tbUploadList = this.logDorderImps;
          console.log('[result] : ', this.tbUploadList);
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

  update(table) {
    table.reset();
  }

  cancelForm() {
    this.submitted = false;
    this.uploadForm.reset();
    this.uploadForm.get('currentDate').setValue(new Date());
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
        if (this.lovTbSupplierListById['suplayoutVers']) {
          this.uploadForm.get('mLayoutVers').patchValue({
            'label' : this.lovTbSupplierListById['layoutName'],
            'value' : this.lovTbSupplierListById['suplayoutVers']
          });
        } else {
          this.uploadForm.get('mLayoutVers').setValue(null);
        }

        // set lov supreleasePort
        if (this.lovTbSupplierListById['supreleasePort']) {
          this.uploadForm.get('supreleasePort').patchValue({
            'label' : this.lovTbSupplierListById['supreleasePortName'],
            'value' : this.lovTbSupplierListById['supreleasePort']
          });
        } else {
          this.uploadForm.get('supreleasePort').setValue(null);
        }

        // set lov supcargoPort
        if (this.lovTbSupplierListById['supcargoPort']) {
          this.uploadForm.get('supcargoPort').patchValue({
            'label' : this.lovTbSupplierListById['supcargoPortName'],
            'value' : this.lovTbSupplierListById['supcargoPort']
          });
        } else {
          this.uploadForm.get('supcargoPort').setValue(null);
        }

        // set lov PlantCode/Area
        if (this.lovTbSupplierListById['supplantCode']) {
          this.uploadForm.get('supplantCode').setValue(this.lovTbSupplierListById['supplantCode']);
        } else {
          this.uploadForm.get('supplantCode').setValue(null);
        }

      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('[catchError] : ', err);
          })
      )
    ).subscribe();
    // .subscribe(res => this.lovTbSupplierListById = res);
  }

  getLovTbConsigneeList(event) {
    console.log('[event] : ', event.query);
    console.log('[supSerial] : ', this.uploadForm.get('tbSupplier').value);
    this.fwLovService.getTbConsignee().subscribe(res => this.lovTbConsigneeList = res);
    console.log('[lovList 1]', this.lovTbConsigneeList);
    if (this.uploadForm.get('tbSupplier').value) {
      const supSerial = this.uploadForm.get('tbSupplier').value['value'];
      this.lovTbConsigneeSelectedList =  this.lovTbConsigneeList.filter(obj => obj.supSerial === supSerial);
    } else {
      this.lovTbConsigneeSelectedList = this.lovTbConsigneeList;
    }
    console.log('[lovList 2]', this.lovTbConsigneeList);
    // console.log('[lovList]', this.lovTbConsigneeList);
    // this.lovTbConsigneeSelectedList = this.lovTbConsigneeList;
    if (event.query) {
        this.lovTbConsigneeSelectedList = this.lovTbConsigneeList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovTbConsigneeSelectedList);
        if (this.lovTbConsigneeSelectedList.length === 0) {
          this.lovTbConsignee.onClear.emit();
        }
    }
  }

  getLovMLayoutVersList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMLayoutVers().subscribe(res => this.lovMLayoutVersList = res);
    console.log('[lovList]', this.lovMLayoutVersList);
    this.lovMLayoutVersSelectedList = this.lovMLayoutVersList;
    if (event.query) {
        this.lovMLayoutVersSelectedList = this.lovMLayoutVersList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovMLayoutVersSelectedList);
        if (this.lovMLayoutVersSelectedList.length === 0) {
          this.lovMLayoutVers.onClear.emit();
        }
    }
  }

  getLovMTranFzList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMTranFz().subscribe(res => this.lovMTranFzList = res);
    console.log('[lovList]', this.lovMTranFzList);
    this.lovMTranFzSelectedList = this.lovMTranFzList;
    if (event.query) {
        this.lovMTranFzSelectedList = this.lovMTranFzList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovMTranFzSelectedList);
        if (this.lovMTranFzSelectedList.length === 0) {
          this.lovMTranFz.onClear.emit();
        }
    }
  }

  getLovSupreleasePortList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMAreaPort().subscribe(res => this.lovSupreleasePortList = res);
    console.log('[lovList]', this.lovSupreleasePortList);
    this.lovSupreleasePortSelectedList = this.lovSupreleasePortList;
    if (event.query) {
        this.lovSupreleasePortSelectedList = this.lovSupreleasePortList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovSupreleasePortSelectedList);
        if (this.lovSupreleasePortSelectedList.length === 0) {
          this.lovSupreleasePort.onClear.emit();
        }
    }
  }

  getLovSupcargoPortList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMAreaPort().subscribe(res => this.lovSupcargoPortList = res);
    console.log('[lovList]', this.lovSupcargoPortList);
    this.lovSupcargoPortSelectedList = this.lovSupcargoPortList;
    if (event.query) {
        this.lovSupcargoPortSelectedList = this.lovSupcargoPortList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovSupcargoPortSelectedList);
        if (this.lovSupcargoPortSelectedList.length === 0) {
          this.lovSupcargoPort.onClear.emit();
        }
    }
  }

  getLovMCountryList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMCountry().subscribe(res => this.lovMCountryList = res);
    console.log('[lovList]', this.lovMCountryList);
    this.lovMCountrySelectedList = this.lovMCountryList;
    if (event.query) {
        this.lovMCountrySelectedList = this.lovMCountryList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovMCountrySelectedList);
        if (this.lovMCountrySelectedList.length === 0) {
          this.lovMCountry.onClear.emit();
        }
    }
  }

  getLovMMoneyList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMMoney().subscribe(res => this.lovMMoneyList = res);
    console.log('[lovList]', this.lovMMoneyList);
    this.lovMMoneySelectedList = this.lovMMoneyList;
    if (event.query) {
      this.lovMMoneySelectedList = this.lovMMoneyList.filter(obj => obj.label.indexOf(event.query) !== -1);
      console.log('[lovSelected]', this.lovMMoneySelectedList);
      if (this.lovMMoneySelectedList.length === 0) {
        this.lovMMoney.onClear.emit();
      }
    }
  }

  lovOnClear() {
    console.log('lovOnClear');
  }

  datepickerSelected() {
    console.log('datepickerSelected');
  }

  get f() {
    return this.uploadForm.controls;
  }
}
