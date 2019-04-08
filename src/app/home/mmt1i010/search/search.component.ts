import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i010Service } from 'src/app/_services/mmt1i010.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { TbBuyer } from '../../models/tb-buyer';
import { environment } from 'src/environments/environment';
import { Paginator } from 'primeng/primeng';

@Component({
  selector: 'mmt1i010-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i010.component.css']
})
export class Mmt1i010SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @ViewChild('tb') table: Table;
  @ViewChild('byrCode') byrCode: ElementRef;

  @ViewChild('captcha') public captcha: ElementRef;

  @ViewChild('tb') public tb: Table;
  @ViewChild('p') paginator: Paginator;

  tbBuyerList: TbBuyer[];
  tbBuyerSelectList: TbBuyer[];

  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  captchaUrl: any;
  captchaUrlShow: boolean;
  private api: any = environment.apiUrl;
  // private captchaUrl: any = `${this.api}/mmt1i010/generateCaptchaImage`;
  // private captchaUrl: any = this.mmt1i010Service.generateCaptchaImage();
  code: string;

  currentOffset = 0;
  currentLimit = 100;
  currentCount: number;
  currentPage: number;
  currentRows: number;

  offset: number = 0;
  limit: number = 10;

  countRows:number;

  constructor(private formBuilder: FormBuilder, private mmt1i010Service: Mmt1i010Service) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      byrCode: [null],
      byrNameTh: [null]
    });
    this.cols = [
      { field: 'byrCode', header: 'รหัสผู้ซื้อ', style: {'text-align' : 'center'} },
      { field: 'byrNameTh', header: 'ชื่อผู้ซื้อ' },

      { field: 'byrtaxIncentive', header: 'Tax Incentive' },
      { field: 'byrtaxId', header: 'TaxId' },
      { field: 'byrbranchCode', header: 'รหัสสาขา' },
      { field: 'provinceDesc', header: 'จังหวัด' },
      { field: 'orderDesc', header: 'รูปแบบ Order', style: {'text-align' : 'center'} }
    ];

    this.currentRows = 5;
    // this.generateCaptchaImage();
    // this.getCaptchaUrl();
    // this.setCanvasCaptcha();
  }

  update(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbBuyerList = null;
    this.tbBuyerSelectList = null;
  }

  cancelForm() {
    this.searchForm.reset();
    this.clearTable();
    this.byrCode.nativeElement.focus();
  }

  onAddBuyer() {
    const buyer = new TbBuyer();
    this.onOpenSaveComponent.emit({ mode: 'add', obj: buyer });
  }

  onEditBuyer(buyer: TbBuyer) {
    this.onOpenSaveComponent.emit({ mode: 'edit', obj: buyer });
  }

  onDeleteBuyer() {
    if (this.tbBuyerSelectList && this.tbBuyerSelectList.length > 0) {
      this.tbBuyerSelectList.forEach(file => {
        this.mmt1i010Service
          .deleteTbBuyer(file.byrSerial)
          .pipe(
            tap(res => {
              this.loading = true;
              this.onSearchBuyer();
              this.fwMsg.messageSuccess('ลบข้อมูลสำเร็จ');
              this.update(this.table);
            }
            ), catchError(
              err =>
                new Observable(() => {
                  this.fwMsg.messageError('ไม่สามารถลบข้อมูลได้');
                  this.loading = false;
                  return;
                }))).subscribe();
      });
      this.tbBuyerSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  onSearchBuyer() {
    // this.paginator.changePage(0);
    // this.searchBtnClick = true;
    const offset = 0;
    const limit = 30;
    this.searchTbBuyer(offset, limit, true);
    this.update(this.table);
    this.tbBuyerSelectList = [];
  }

  loadCarsLazy(event: LazyLoadEvent) {
    console.log('loadCarsLazy');
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbBuyer(this.offset, this.limit, false);


      console.log('this.offset==>',this.offset);
      console.log('this.limit==>',this.limit);


    }
    // this.currentOffset = event.first;
    // this.currentLimit = event.rows;
    // console.log('current offset:[' + this.currentOffset + '] limit:[' + this.currentLimit + ']');
  }

  private searchTbBuyer(offset: number, limit: number, onClickSearch: boolean) {
    console.log('searchTbBuyer');
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbBuyer = this.fwMsg.copy(this.searchForm.getRawValue(), new TbBuyer);
    const createBy = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    payload = this.fwMsg.append(payload, { offset, limit, createBy });


///////////// get row count ///////
    this.mmt1i010Service
    .getCountBuyer(payload)
    .pipe(
      tap(res => {
        this.loading = false;
        this.countRows = res;
        if (onClickSearch) {

          console.log('countRows===>',this.countRows)
          this.totalRecords = this.countRows;
          this.currentCount = this.totalRecords;
        }
      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('catchError--->', err.data);
            this.loading = false;
            this.fwMsg.messageError('ไม่สามารถค้นหาได้');
          })
      )
    ).subscribe();

    ///////////// get row data ///////
    this.mmt1i010Service
      .getBuyer(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbBuyerList = res;
          if (onClickSearch) {
            //this.totalRecords = this.tbBuyerList.length;
           // this.currentCount = this.totalRecords;
          }
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('catchError--->', err.data);
              this.loading = false;
              this.fwMsg.messageError('ไม่สามารถค้นหาได้');
            })
        )
      ).subscribe();
  }

  paginate(event) {
    console.log('paginate-->', event);
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.currentPage = event.page;
    this.currentRows = event.rows;
    this.searchTbBuyer(event.first, event.rows, false);
}

  onSaveSuccess(mode: string) {
    this.loading = true;
    // this.searchTbBuyer(this.offset, this.limit, false);
    if (mode === 'add') {
      this.onSearchBuyer();
    } else {
      this.searchTbBuyer(this.offset, this.limit, false);
    }

    // this.onSearchBuyer();
    // console.log('currentPage-->', this.currentPage);
    // this.paginator.changePage(this.currentPage);
    /* console.log('onSaveSuccess offset:[' + this.currentOffset + '] limit:[' + this.currentLimit + ']');
    this.searchTbBuyer(this.currentOffset, this.tbBuyerList.length, true); */
  }

  /* generateCaptchaImage() {
    // tslint:disable-next-line:max-line-length
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmemFkbWluIiwiYXV0aCI6W10sImlhdCI6MTU0NzQ0NjUxMCwiZXhwIjoxNTQ4NTMyOTEwfQ.iddQPm6aGZSujZClULn6-wCiuKGCRTy_ClFDdq40tVg');
    this.captchaUrl = this.mmt1i010Service.generateCaptchaImage();
    console.log('captchaUrl--->', this.captchaUrl);
  } */

  getCaptchaUrl() {
    const request = new XMLHttpRequest();
    const token = JSON.parse(localStorage.getItem('currentUser')).token;
    // tslint:disable-next-line:max-line-length
    
    // this.captchaUrl = this.mmt1i010Service.generateCaptchaImage();
    const url = `${this.api}/mmt1i010/generateCaptchaImage`;
    // request.setRequestHeader('Authorization', 'Bearer ' + token);
    // request.open('GET', this.captchaUrl, true);
    // this.captchaUrl = request.open('GET', url, true);
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.open('GET', url, true);
    console.log('token--->', token);
    console.log('request.status--->', request.status);
    this.captchaUrlShow = true;
  }

  setCanvasCaptcha() {
    console.log('captcha--->', this.captcha);
    const canvasElement = this.captcha.nativeElement;
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width , canvasElement.height);
    ctx.font = 'italic 70px Arial';
    ctx.textAlign = 'center';
    ctx. textBaseline = 'middle';
    ctx.fillStyle = 'red';
    ctx.fillText(this.randomTextCaptcha(), 150, 75);
    /* ctx.fillText('A', 45, 85);
    ctx.font = 'italic 30px Arial';
    ctx.fillText('B', 100, 65);
    ctx.font = 'italic 60px Arial';
    ctx.fillText('C', 150, 75);
    ctx.font = 'italic 50px Arial';
    ctx.fillText('D', 200, 75);
    ctx.fillText('E', 250, 75);
    ctx.fillText('F', 280, 75); */
  }

  randomTextCaptcha() {
    const char = [ '0', '1', '2', '3', '4', '5', '6',
            '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
            'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W', 'Z', 'Y', 'Z' ];

    /* const index1 = Math.floor(Math.random() * 62);
    const index2 = Math.floor(Math.random() * 62);
    const index3 = Math.floor(Math.random() * 62);
    const index4 = Math.floor(Math.random() * 62);
    const index5 = Math.floor(Math.random() * 62);
    const index6 = Math.floor(Math.random() * 62);
    console.log('char[' + index1 + ']--->', char[index1]);
    console.log('char[' + index2 + ']--->', char[index2]);
    console.log('char[' + index3 + ']--->', char[index3]);
    console.log('char[' + index4 + ']--->', char[index4]);
    console.log('char[' + index5 + ']--->', char[index5]);
    console.log('char[' + index6 + ']--->', char[index6]);
    const captchaText = char[index1] + char[index2] + char[index3] + char[index4] + char[index5] + char[index6]; */

    let captchaText = '';
    for (let i = 1; i <= 6; i++ ) {
      const index = Math.floor(Math.random() * 62);
      console.log('char[' + i + ']--->', char[index]);
      captchaText += char[index];
    }

    return captchaText;

  }
}
