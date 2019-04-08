import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i020Service } from 'src/app/_services/mmt1i020.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { TbSupplier } from '../../models/tb-supplier';
import { FzConstant } from 'src/app/shared/constant/FzConstant';

import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';
import { Paginator } from 'primeng/primeng';

@Component({
  selector: 'app-mmt1i020-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i020.component.css']
})
export class Mmt1i020SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @ViewChild('tb') table: Table;
  @ViewChild('p') paginator: Paginator;
  @ViewChild('supCode') supCode: ElementRef;

  tbSupplierList: TbSupplier[];
  tbSupplierSelectList: TbSupplier[];

  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick = false;
  pagingIndex: number;
  cols: any[];

  // currentOffset = 0;
  // currentLimit = 100;

  offset = 0;
  limit = 100;
  currentCount: number;
  currentPage: number;
  currentRows: number;

  countRows: number;

  constructor(private formBuilder: FormBuilder, private mmt1i020Service: Mmt1i020Service, private fzConstant: FzConstant) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      supCode: [null],
      supNameTh: [null]
    });
    this.cols = [
      { field: 'supCode', header: 'รหัสผู้ส่งออก' },
      { field: 'supNameTh', header: 'ชื่อบริษัทผู้ส่งออก' },

      { field: 'suptaxIncentive', header: 'Tax Incentive' },
      { field: 'suptaxId', header: 'TaxId' },
      { field: 'supbranchName', header: 'รหัสสาขา' },
      { field: 'provinceDesc', header: 'จังหวัด' },
      { field: 'supstsFlagDesc', header: 'สถานะ' }
    ];

    this.currentRows = 5;
  }

  update(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbSupplierList = null;
    this.tbSupplierSelectList = null;
  }

  cancelForm() {
    this.searchForm.reset();
    this.supCode.nativeElement.focus();
    this.clearTable();
  }

  onAddSupplier() {
    const buyer = new TbSupplier();
    this.onOpenSaveComponent.emit({ mode: 'add', obj: buyer });
  }

  onEditSupplier(buyer: TbSupplier) {
    this.onOpenSaveComponent.emit({ mode: 'edit', obj: buyer });
  }

  onDeleteSupplier() {
    if (this.tbSupplierSelectList && this.tbSupplierSelectList.length > 0) {
      this.mmt1i020Service.deleteTbSupplierList(this.tbSupplierSelectList)
        .pipe(
          tap(res => {
            this.loading = true;
            this.onSearchSupplier();
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
      this.tbSupplierSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  onSearchSupplier() {
    const offset = 0;
    const limit = 100;
    this.searchTbSupplier(offset, limit, true);
    this.update(this.table);
    this.tbSupplierSelectList = [];
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbSupplier(this.offset, this.limit, false);
    }
    // this.currentOffset = event.first;
    // this.currentLimit = event.rows;
    // console.log('current offset:[' + this.currentOffset + '] limit:[' + this.currentLimit + ']');
  }

  private searchTbSupplier(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbSupplier = this.fwMsg.copy(this.searchForm.getRawValue(), new TbSupplier);
    payload = this.fwMsg.append(payload, { offset, limit });
    this.mmt1i020Service
      .getCountTbSupplier(payload)
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
              console.log('catchError--->', err);
              this.loading = false;
              this.fwMsg.messageError('ไม่สามารถค้นหาได้');
            })
        )
      ).subscribe();

    this.mmt1i020Service
      .getTbSupplier(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbSupplierList = res;
          this.tbSupplierList.forEach(value => {
                value.supstsFlagDesc = (value.supstsFlag != null ? this.fzConstant.SUP_STS_FLAG_MAP.get(value.supstsFlag.toString()) : null);
          });
          if (onClickSearch) {
            // this.totalRecords = this.tbSupplierList.length;
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

  onSaveSuccess(mode: string) {
    // this.loading = true;
    // this.onSearchSupplier();
    // this.paginator.changePage(this.currentPage);
    this.loading = true;
    // this.searchTbSupplier(this.offset, this.limit, false);
    if (mode === 'add') {
      this.onSearchSupplier();
    } else {
      this.searchTbSupplier(this.offset, this.limit, false);
    }
  }

  paginate(event) {
    console.log('paginate-->', event);
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.currentPage = event.page;
    this.currentRows = event.rows;
    this.searchTbSupplier(event.first, event.rows, false);
}
}
