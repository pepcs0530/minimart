import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i060Service } from 'src/app/_services/mmt1i060.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { TbUnit } from '../../models/tb-unit';
import { FzConstant } from 'src/app/shared/constant/FzConstant';
import { HttpResponse } from '@angular/common/http';



@Component({
  selector: 'mmt1i060-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i060.component.css']
})
export class Mmt1i060SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @Input() Mmt1i060SearchComponent: Mmt1i060SearchComponent;
  @ViewChild('tb') table: Table;
  // @ViewChild('supCode') supCode: ElementRef;

  // tbBuyerList: TbBuyer[];
  // tbBuyerSelectList: TbBuyer[];
  tbUnitList: TbUnit[];
  tbUnitSelectList: TbUnit[];
  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  offset: number = 0;
  limit: number = 100;

  constructor(private formBuilder: FormBuilder,private Mmt1i060Service: Mmt1i060Service,private fzConstant: FzConstant) {
  }

  ngOnInit() {
    //this.loading = false;

    this.searchForm = this.formBuilder.group({
      unitNameEng: [null],
      unitSerial: [null],
    });
    this.cols = [
      { field: 'unitCode', header: 'รหัสหน่วยสินค้า', style: {'text-align' : 'center'} },
      { field: 'unitNameEng', header: 'ชื่อหน่วยสินค้า', style: {'text-align' : 'left'} },
      { field: 'weightDesc', header: 'หน่วยเป็นน้ำหนัก', style: {'text-align' : 'center'} },
      { field: 'unitPpl', header: 'รหัสกรมฯPPL', style: {'text-align' : 'center'} },
      { field: 'unitPkg', header: 'หน่วยหีบห่อ', style: {'text-align' : 'center'} },
      // { field: 'byrProvinceId', header: 'จังหวัด' },
      // { field: 'byrPplno', header: 'รูปแบบ Order' }
    ];
  }


  updateUnit(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbUnitList = [];
    this.tbUnitSelectList = [];
  }

  cancelForm() {
    this.searchForm.reset();
    this.clearTable();
    // this.supCode.nativeElement.focus();
  }

  onAddUnit() {
    let unit = new TbUnit();
    this.onOpenSaveComponent.emit({mode:'add',obj:unit});
  }

  onEditUnit(TbUnit: TbUnit) {
    this.onOpenSaveComponent.emit({mode:'edit',obj:TbUnit});
  }
  onDeleteUnit() {
    if (this.tbUnitSelectList != null && this.tbUnitSelectList.length > 0) {
      // this.tbUnitSelectList.forEach(file => {
        this.Mmt1i060Service
          .deleteUnitList(this.tbUnitSelectList)
          .pipe(
            tap(res => {
              this.loading = true;
              this.onsearchTbUnit();
             this.fwMsg.messageSuccess('ลบข้อมูลสำเร็จ');
              this.updateUnit(this.table);
            }
            ), catchError(
              err =>
                new Observable(() => {
                //  alert('saaaa');
                  this.fwMsg.messageError('ไม่สามารถลบข้อมูลได้');
                  this.loading = false;
                  return;
                }))).subscribe();
      // });
      this.tbUnitSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  onsearchTbUnit() {
    // this.searchBtnClick = true;
    const offset = 0;
    const limit = 100;
    this.searchTbUnit(offset, limit, true);
    this.updateUnit(this.table);
    this.tbUnitSelectList = [];
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbUnit(this.offset, this.limit, false);
      // this.searchBtnClick = true;
      // this.loading = true;
    }
  }

  private searchTbUnit(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbUnit = this.fwMsg.copy(this.searchForm.getRawValue(), new TbUnit);
    payload = this.fwMsg.append(payload, { offset, limit });
    //count
    this.Mmt1i060Service
      .getCountUnit(payload)
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

    this.Mmt1i060Service
      .getUnit(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbUnitList = res;
          

         // if(this.totalRecords == 0 || this.totalRecords == undefined){
          /* if (this.totalRecords === 0 || this.totalRecords === undefined) {
            this.totalRecords = this.tbUnitList.length;
          } else if (this.totalRecords > 0) {
            this.totalRecords = this.tbUnitList.length;
          } */

          if (onClickSearch && (this.totalRecords === undefined || this.totalRecords === 0)) {
            this.totalRecords = this.tbUnitList.length;
          } else {
            if (onClickSearch) {
              this.totalRecords = this.tbUnitList.length;
            }
          }

          this.tbUnitList.forEach(value => {
            value.weightDesc = (value.weightFlag != null ? this.fzConstant.WEIGHT_FLAG_MAP.get(value.weightFlag.toString()) : null);
          });

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
    // this.onsearchTbUnit();
    // this.searchTbUnit(this.offset, this.limit, false);
    if (mode === 'add') {
      this.onsearchTbUnit();
    } else {
      this.searchTbUnit(this.offset, this.limit, false);
    }
  }
}
