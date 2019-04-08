import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i050Service } from 'src/app/_services/mmt1i050.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';

import { Table } from 'primeng/table';
import { TbPricecf } from '../../models/tb-pricecf';
import { FzConstant } from 'src/app/shared/constant/FzConstant';
import { style } from '@angular/animations';

@Component({
  selector: 'mmt1i050-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i050.component.css']
})
export class Mmt1i050SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @Output() onOpenUploadComponent = new EventEmitter();
  

  @ViewChild('tb') table: Table;
  @ViewChild('proCode') proCode: ElementRef;

  tbPricecfList: TbPricecf[];
  tbPricecfSelectList: TbPricecf[];

  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  offset: number = 0;
  limit: number = 100;

  constructor(private formBuilder: FormBuilder, private mmt1i050Service: Mmt1i050Service, private fzConstant:FzConstant) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      supSerial: [null],
      partNo: [null],
      pricecfNo: [null]
    });

    this.cols = [
      { field: 'pricecfSerial', header: 'Ref' },
      { field: 'supCode', header: 'รหัสผู้ส่งออก' },
      { field: 'partNo', header: 'PartNo' },
      { field: 'pricecfNo', header: 'Price Confirm' },
      { field: 'priceUnit', header: 'ราคา/หน่วย' },
      { field: 'startDate', header: 'วันที่เริ่มต้น' },
      { field: 'endDate', header: 'วันที่สิ้นสุด' }
    ];
  }

  update(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbPricecfList = [];
    this.tbPricecfSelectList = [];
  }

  cancelForm() {
    this.searchForm.reset();
    // this.proCode.nativeElement.focus();
    this.clearTable();
  }

  onAddPrice() {
    const buyer = new TbPricecf();
    this.onOpenSaveComponent.emit({ mode: 'add', obj: buyer });
  }

  onEditPrice(buyer: TbPricecf) {
    this.onOpenSaveComponent.emit({ mode: 'edit', obj: buyer });
  }

  onDeletePrice() {
    if (this.tbPricecfSelectList && this.tbPricecfSelectList.length > 0) {
      this.mmt1i050Service.deleteTbPricecfList(this.tbPricecfSelectList)
        .pipe(
          tap(res => {
            this.loading = true;
            this.onSearchPrice();
            this.fwMsg.messageSuccess('ลบข้อมูลสำเร็จ');
          }
          ), catchError(
            err =>
              new Observable(() => {
                this.fwMsg.messageError('ไม่สามารถลบข้อมูลได้');
                this.loading = false;
                return;
              }))).subscribe();
      this.tbPricecfSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  onSearchPrice() {
    const offset = 0;
    const limit = 100;
    this.searchTbPricecf(offset, limit, true);
    this.update(this.table);
    this.tbPricecfSelectList = [];
  }
  openUploadPage() {
    this.onOpenUploadComponent.emit({ mode: 'edit', obj: TbPricecf });
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbPricecf(this.offset, this.limit, false);
    }
  }


  private searchTbPricecf(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbPricecf = this.fwMsg.copy(this.searchForm.getRawValue(), new TbPricecf);
    payload = this.fwMsg.append(payload, { offset, limit });
    console.log(payload);
    //count
    this.mmt1i050Service
    .getCountTbPricecf(payload)
    .pipe(
      tap(res => {
        this.loading = false;
        if (onClickSearch) {
          console.log('countRows===>',res)
          this.totalRecords = res;
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

    this.mmt1i050Service
      .getTbPricecf(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbPricecfList = res;
          // this.tbPricecfList.forEach(value => {
          //       value.prostsFlagDesc = (value.prostsFlag != null ? this.fzConstant.SUP_STS_FLAG_MAP.get(value.prostsFlag.toString()) : null);
          // });
          /* if (onClickSearch) {
            this.totalRecords = this.tbPricecfList.length;
          } */
          if (onClickSearch && (this.totalRecords === undefined || this.totalRecords === 0)) {
            this.totalRecords = this.tbPricecfList.length;
          } else {
            if (onClickSearch) {
              this.totalRecords = this.tbPricecfList.length;
            }
          }

          

          console.log('tbPricecfList--->', this.tbPricecfList);
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

  onSaveSuccess(mode: string) {
    this.loading = true;
    // this.onSearchPrice();
    // this.searchTbPricecf(this.offset, this.limit, false);
    if (mode === 'add') {
      this.onSearchPrice();
    } else {
      this.searchTbPricecf(this.offset, this.limit, false);
    }
  }
}
