import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i040Service } from 'src/app/_services/mmt1i040.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { TbProduct } from '../../models/tb-product';
import { FzConstant } from 'src/app/shared/constant/FzConstant';

@Component({
  selector: 'mmt1i040-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i040.component.css']
})
export class Mmt1i040SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @Output() onOpenUploadComponent = new EventEmitter();
  

  @ViewChild('tb') table: Table;
  @ViewChild('proCode') proCode: ElementRef;

  tbProductList: TbProduct[];
  tbProductSelectList: TbProduct[];

  menuNameList: any[];
  offset: number = 0;
  limit: number = 100;
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  constructor(private formBuilder: FormBuilder, private mmt1i040Service: Mmt1i040Service, private fzConstant:FzConstant) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      proCode: [null],
      partNameEng: [null],
      partNo: [null],
      pplTariffNo: [null],
      supSerial: [null],
      partNameTh: [null],
      // pplTariffNo: [null],
      


    });
    this.cols = [
      { field: 'prodSerial', header: 'Ref' },
      { field: 'supSerial', header: 'รหัสผู้ส่งออก' },

      { field: 'partNo', header: 'PartNo' },
      { field: 'partFlag', header: 'ประเภท' },
      { field: 'partNameEng', header: 'ชื่อสินค้า(อังกฤษ)' },
      { field: 'partNameTh', header: 'ชื่อสินค้า(ไทย)' },
      { field: 'partUnit', header: 'หน่วยสินค้า' },
      { field: 'partWeight', header: 'น้ำหนักต่อหน่วย' },
      { field: 'weightUnit', header: 'หน่วยน้ำหนัก' },
      { field: 'pplTariffNo', header: 'พิกัดศุลกากร' },
      { field: 'pplStaticCode', header: 'รหัสสถิติ' },
      { field: 'prostsFlagDesc', header: 'ลำดับอัตราอากร' },
    ];
  }

  update(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbProductList = [];
    this.tbProductSelectList = [];
  }

  cancelForm() {
    this.searchForm.reset();
    // this.proCode.nativeElement.focus();
    this.clearTable();
  }

  onAddProduct() {
    let buyer = new TbProduct();
    this.onOpenSaveComponent.emit({ mode: 'add', obj: buyer });
  }

  onEditProduct(buyer: TbProduct) {
    this.onOpenSaveComponent.emit({ mode: 'edit', obj: buyer });
  }

  onDeleteProduct() {
    if (this.tbProductSelectList && this.tbProductSelectList.length > 0) {
      this.mmt1i040Service.deleteTbProductList(this.tbProductSelectList)
        .pipe(
          tap(res => {
            this.loading = true;
            this.onSearchProduct();
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
      this.tbProductSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  onSearchProduct() {
    this.searchTbProduct(0, 100, true);
    this.update(this.table);
    this.tbProductSelectList = [];
  }
  openUploadPage(){
    this.onOpenUploadComponent.emit({ mode: 'edit', obj: TbProduct });
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbProduct(this.offset, this.limit, false);
    }
  }


  private searchTbProduct(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbProduct = this.fwMsg.copy(this.searchForm.getRawValue(), new TbProduct);
    payload = this.fwMsg.append(payload, { offset, limit });
    // console.log(payload);
    //count 
    this.mmt1i040Service
      .getCountTbProduct(payload)
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

    this.mmt1i040Service
      .getTbProduct(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbProductList = res;
          // this.tbProductList.forEach(value => {
          //       value.prostsFlagDesc = (value.prostsFlag != null ? this.fzConstant.SUP_STS_FLAG_MAP.get(value.prostsFlag.toString()) : null);
          // });
          if (onClickSearch) {
            this.totalRecords = this.tbProductList.length;
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
    this.loading = true;
    if(mode=="add"){
      this.onSearchProduct();
    }else{
      this.searchTbProduct(this.offset, this.limit, false);
    }
  }
}
