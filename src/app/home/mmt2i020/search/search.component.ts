import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Mmt2i020Service } from '../services/mmt2i020.service';
import { HelpersService } from 'src/app/shared/services/helpers/helpers';
import { Table } from 'primeng/table';
import { LogDorderImp } from 'src/app/shared/models/log-dorder-imp';
import { LazyLoadEvent } from 'primeng/api';
import { InvOrderMas } from 'src/app/shared/models/inv-order-mas';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FwMessageComponent } from 'src/app/shared/components/fw-message/fw-message.component';
import { AutoComplete } from 'primeng/primeng';
import { FwLovService } from 'src/app/shared/services/fw-lov/fw-lov-service';
import { dateToStrYYYYMMDD } from 'src/app/shared/utils/date-to-string-yyyymmdd';
import { FwUploadDownloadFileService } from 'src/app/shared/services/fw-upload-download-file/fw-upload-download-file.service';
import { saveAs as importedSaveAs } from 'file-saver';
import { formatDDMMYYYYThaiDate } from 'src/app/shared/utils/format-ddmmyyyy-thai-date';
import { LogDshortImp } from 'src/app/shared/models/log-dshort-imp';
import { InvShortMas } from 'src/app/shared/models/inv-short-mas';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('fwMessage') fwMessage: FwMessageComponent;
  searchForm: FormGroup;
  loading: Boolean = false;
  @ViewChild('tb') table: Table;
  // logDorderImpList: LogDorderImp[];
  // logDorderImpSelectList: LogDorderImp[];
  logDshortImpList: LogDshortImp[];
  logDshortImpSelectList: LogDshortImp[];
  offset = 0;
  limit = 100;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];
  // invOrderMasList: InvOrderMas[];
  // invOrderMasSelectList: InvOrderMas[];
  // invOrderMasSelect: InvOrderMas;
  invShortMasList: InvShortMas[];
  invShortMasSelectList: InvShortMas[];
  invShortMasSelect: InvShortMas;
  maxDate = new Date();

  @ViewChild('lovTbSupplier') lovTbSupplier: AutoComplete;
  lovTbSupplierList: any[];
  lovTbSupplierSelectedList: any[];
  lovTbSupplierListById: any[];

  @ViewChild('lovMJob') lovMJob: AutoComplete;
  lovMJobList: any[];
  lovMJobSelectedList: any[];

  currentOffset = 0;
  currentLimit = 100;
  currentCount: number;
  currentPage: number;
  currentRows: number;
  countRows: number;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    private mmt2i020Service: Mmt2i020Service,
    private fwUploadDownloadFileService: FwUploadDownloadFileService,
    private fwLovService: FwLovService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT2i020 : ข้อมูล SHORT การส่งสินค้า (ORDER)',
        routerLink: 'home/mmt2i020'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt2i020'
      }
    ]);

    this.searchForm = this.formBuilder.group({
      tbSupplier: [null],
      invoiceNo: [null],
      declationNo: [null],
      mJob: [null],
    });

    this.cols = [
      /* { field: 'jonName', header: 'สถานะข้อมูล', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'supCode', header: 'รหัสผู้ส่งออก', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'byrCode', header: 'รหัสผู้ซื้อ', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'invoiceNo', header: 'Invoice No', styleHeader: {'width':'10%', 'word-wrap': 'break-word'},styleBody:{'text-align' : 'center'} },
      { field: 'decDoctype', header: 'Type Dec', styleHeader: {'width':'5%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'dvdateStartToEnd', header: 'Delivery Date', styleHeader: {'width':'10%'},styleBody:{'text-align' : 'center'} },
      { field: 'pplRefNo', header: 'Ref No', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'customsRefNo', header: 'Declation No', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'pplDate', header: 'Date PPL', styleHeader: {'width':'10%'} ,styleBody:{'text-align' : 'center'}},
      { field: 'cancelRemark', header: 'หมายเหตุ', styleHeader: {} ,styleBody:{'text-align' : 'center'}}, */
      { field: '', header: 'Download file', styleHeader: {'width': '10%'} , styleBody: {'text-align' : 'center'}},
      { field: '', header: 'สถานะข้อมูล', styleHeader: {'width': '15%'} , styleBody: {'text-align' : 'center'}},
      { field: '', header: 'วันที่ส่งข้อมูล', styleHeader: {'width': '10%'} , styleBody: {'text-align' : 'center'}},
      { field: '', header: 'รหัสผู้ส่งออก', styleHeader: {'width': '10%'} , styleBody: {'text-align' : 'center'}},
      { field: '', header: 'INVOICE NO', styleHeader: {'width': '10%'} , styleBody: {'text-align' : 'center'}},
      { field: '', header: 'หมายเหตุ', styleHeader: {'width': '15%'} , styleBody: {'text-align' : 'center'}},
    ];

    this.fwLovService.getTbSupplier().subscribe(res => this.lovTbSupplierList = res);
    this.fwLovService.getMJob().subscribe(res => this.lovMJobList = res);
  }

  search() {
    this.getInvShortMas(this.offset, this.limit, true);
    this.invShortMasSelectList = [];
  }

  getInvShortMas(offset: number, limit: number, onClickSearch: boolean) {
    console.log('[payload] : ', this.searchForm.value);
    this.loading = true;
    this.onClickSearch = true;
    let payload: InvShortMas = this.helpers.copy(this.searchForm.getRawValue(), new InvShortMas);
    const supCode = this.helpers.getValueFromAbstractControl(this.searchForm.get('tbSupplier').value, 'supCode');
    const invoiceNo = this.searchForm.get('invoiceNo').value;
    const declationNo = this.searchForm.get('declationNo').value;
    const createBy = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    payload = this.helpers.append(payload,
      {
        offset, limit, supCode, invoiceNo, declationNo, createBy
      });
    console.log('[payload] : ', payload);
    ///////////// get row count ///////
    this.mmt2i020Service
    .getCountInvShortMas(payload)
    .pipe(
      tap(res => {
        this.loading = false;
        this.countRows = res;
        if (onClickSearch) {

          console.log('countRows===>', this.countRows);
          this.totalRecords = this.countRows;
          this.currentCount = this.totalRecords;
        }
      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('catchError--->', err.data);
            this.loading = false;
            this.fwMessage.messageError('ไม่สามารถค้นหาได้');
          })
      )
    ).subscribe();

    this.mmt2i020Service
      .getInvShortMas(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          res.forEach(element => {
            const dvdateStart = formatDDMMYYYYThaiDate(element.dvdateStart);
            const dvdateEnd = formatDDMMYYYYThaiDate(element.dvdateEnd);
            element.dvdateStartToEnd = (dvdateStart ? dvdateStart : '') + ' - ' + (dvdateEnd ? dvdateEnd : '');
          });
          this.invShortMasList = res;
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err.data);
              this.loading = false;
              this.fwMessage.messageError('ไม่สามารถค้นหาได้');
            })
        )
      ).subscribe();
  }

  reset() {
    this.searchForm.reset();
    this.clearTable();
  }

  clearTable() {
    this.totalRecords = 0;
    this.invShortMasList = null;
    this.invShortMasSelectList = null;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.getInvShortMas(offset, limit, false);
    }
  }

  toUploadPage() {
    this.router.navigate(['/home/mmt2i020/upload']);
  }

  toAddPage() {
    // this.mmt2i020Service.fwUserBean = null;
    this.router.navigate(['/home/mmt2i020/add']);
  }

  selectRowData(rowData) {

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

  getLovMJobList(event) {
    console.log('[event] : ', event.query);
    this.fwLovService.getMJob().subscribe(res => this.lovMJobList = res);
    console.log('[lovList]', this.lovMJobList);
    this.lovMJobSelectedList = this.lovMJobList;
    if (event.query) {
        this.lovMJobSelectedList = this.lovMJobList.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovMJobSelectedList);
        if (this.lovMJobSelectedList.length === 0) {
          this.lovMJob.onClear.emit();
        }
    }
  }

  onRowSelect(event) {
    console.log('[onRowSelect] : ', event.data);
    this.mmt2i020Service.invShortMasBean = event.data;
    console.log('[bean] : ', this.mmt2i020Service.invShortMasBean);
    this.router.navigate(['/home/mmt2i020/detail']);
  }

  exportFile(filename) {
    console.log('[exportFile] : ', filename);
    this.fwUploadDownloadFileService.downloadFile(filename)
      .subscribe(resultBlob => {
        // Success
        console.log('start download:', resultBlob);
        const blob = new Blob([resultBlob], { type: 'application/pdf' });
        importedSaveAs(blob, filename);
      },
        error => {
          // Error
          console.log(error);
          this.fwMessage.messageError('ไม่สามารถดาวน์โหลดได้ เนื่องจากไม่พบไฟล์ดังกล่าว');
        });
  }

  /* downloadFile(data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  } */
}

