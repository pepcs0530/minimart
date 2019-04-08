import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Mmt2i010Service } from '../services/mmt2i010.service';
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
import { ChatService } from 'src/app/shared/services/fw-chat/chat.service';

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
  logDorderImpList: LogDorderImp[];
  logDorderImpSelectList: LogDorderImp[];
  offset = 0;
  limit = 100;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];
  invOrderMasList: InvOrderMas[];
  invOrderMasSelectList: InvOrderMas[];
  invOrderMasSelect: InvOrderMas;
  maxDate = new Date();

  @ViewChild('lovTbSupplier') lovTbSupplier: AutoComplete;
  lovTbSupplierList: any[];
  lovTbSupplierSelectedList: any[];
  lovTbSupplierListById: any[];

  @ViewChild('lovMJob') lovMJob: AutoComplete;
  lovMJobList: any[];
  lovMJobSelectedList: any[];

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    private mmt2i010Service: Mmt2i010Service,
    private fwUploadDownloadFileService: FwUploadDownloadFileService,
    private fwLovService: FwLovService,
    private chatService: ChatService,
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
      }
    ]);

    this.searchForm = this.formBuilder.group({
      tbSupplier: [null],
      startSendDate: [null],
      endSendDate: [null],
      impFilename: [null],
      mJob: [null]
    });

    this.cols = [
      /* { field: 'ref', header: 'ref' }, */
      { field: 'impFilename', header: 'ชื่อไฟล์', style: {'text-align' : 'left', 'word-wrap': 'break-word'}, width : '270px' },
      { field: 'jobName', header: 'สถานะข้อมูล', style: {'text-align' : 'center'}, width : '270px' },
      { field: 'jobhDate', header: 'วันที่ส่งข้อมูล', style: {'text-align' : 'center'}, width : '130px' },
      { field: 'supCode', header: 'รหัสผู้ส่งออก', style: {'text-align' : 'center'}, width : '130px' },
      { field: 'byrCode', header: 'รหัสผู้ซื้อ', style: {'text-align' : 'center'}, width : '130px' },
      { field: 'invoiceNo', header: 'Invoice No', style: {'text-align' : 'center'}, width : '200px' },
      { field: 'decDoctype', header: 'TypeDec', style: {'text-align' : 'center'}, width : '150px' },
      { field: 'controlCode', header: 'Delivery Code', style: {'text-align' : 'center'}, width : '130px' },
      { field: 'deliveryDate', header: 'Delivery Date', width : '200px' },
      { field: 'pplRefno', header: 'Ref No', style: {'text-align' : 'center'}, width : '150px' },
      { field: 'customsRefno', header: 'Declation No', style: {'text-align' : 'center'}, width : '150px' },
      { field: 'pplDate', header: 'Date PPL', style: {'text-align' : 'center'}, width : '150px' },
      { field: 'cancelRemark', header: 'หมายเหตุ', width : '200px' }
    ];

    this.fwLovService.getTbSupplier().subscribe(res => this.lovTbSupplierList = res);
    this.fwLovService.getMJob().subscribe(res => this.lovMJobList = res);
  }

  search() {
    this.getInvOrderMas(this.offset, this.limit, true);
    this.invOrderMasSelectList = [];
    
    // ทดสอบ websocket
    // this.chatService.sendNotification('Call Websocket...');
  }

  getInvOrderMas(offset: number, limit: number, onClickSearch: boolean) {
    console.log('[payload] : ', this.searchForm.value);
    this.loading = true;
    this.onClickSearch = true;
    let payload: InvOrderMas = this.helpers.copy(this.searchForm.getRawValue(), new InvOrderMas);
    const supCode = this.helpers.getValueFromAbstractControl(this.searchForm.get('tbSupplier').value, 'supCode');
    const startSendDate = dateToStrYYYYMMDD(this.searchForm.get('startSendDate').value);
    const endSendDate = dateToStrYYYYMMDD(this.searchForm.get('endSendDate').value);
    const impFilename = this.searchForm.get('impFilename').value;
    const jobId = this.helpers.getValueFromAbstractControl(this.searchForm.get('mJob').value, 'value');
    const createBy = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    payload = this.helpers.append(payload,
      {
        offset, limit, supCode, startSendDate, endSendDate, impFilename, jobId, createBy
      });
    console.log('[payload] : ', payload);
    this.mmt2i010Service
      .getInvOrderMas(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.invOrderMasList = res;
          if (onClickSearch) {
            this.totalRecords = this.invOrderMasList.length;
          }
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
    this.invOrderMasList = null;
    this.invOrderMasSelectList = null;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.getInvOrderMas(offset, limit, false);
    }
  }

  toUploadPage() {
    this.router.navigate(['/home/mmt2i010/upload']);
  }

  toAddPage() {
    // this.mmt2i010Service.fwUserBean = null;
    this.router.navigate(['/home/mmt2i010/add']);
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
    this.mmt2i010Service.invOrderMasBean = event.data;
    console.log('[bean] : ', this.mmt2i010Service.invOrderMasBean);
    this.router.navigate(['/home/mmt2i010/detail']);
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

