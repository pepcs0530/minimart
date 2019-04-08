import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Mmt1i030Service } from 'src/app/_services/mmt1i030.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { TbConsignee } from '../../models/tb-consignee';
import { FzConstant } from 'src/app/shared/constant/FzConstant';


import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'mmt1i030-search',
  templateUrl: 'search.component.html',
  styleUrls: ['../mmt1i030.component.css']
})
export class Mmt1i030SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @Input() Mmt1i030SearchComponent: Mmt1i030SearchComponent;
  @ViewChild('tb') table: Table;
  @ViewChild('supSerial') supSerial: ElementRef;

  // tbBuyerList: TbBuyer[];
  // tbBuyerSelectList: TbBuyer[];
  tbConsigneeList: TbConsignee[];
  tbConsigneeSelectList: TbConsignee[];
  menuNameList: any[];
  offset: number = 0;
  limit: number = 100;
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  constructor(private formBuilder: FormBuilder,private Mmt1i030Service: Mmt1i030Service,private fzConstant: FzConstant) {
  }

  ngOnInit() {


    this.searchForm = this.formBuilder.group({
      supNameEng: [null],
      supSerial: [null],
    });
    this.cols = [
      { field: 'supSerial', header: 'รหัสผู้ส่งออก' },
      { field: 'supNameEng', header: 'ชื่อบริษัทผู้ส่งออก' },

      { field: 'isFzDesc', header: 'สิทธิ' },
      { field: 'byrSerial', header: 'รหัสผู้ซื้อ' },
      { field: 'byrNameEng', header: 'ชื่อบริษัทผู้ซื้อ' },
      // { field: 'byrProvinceId', header: 'จังหวัด' },
      // { field: 'byrPplno', header: 'รูปแบบ Order' }
    ];
  }


  updateConsignee(table) {
    table.reset();
  }

  clearTable() {
    this.totalRecords = 0;
    this.tbConsigneeList = null;
    this.tbConsigneeSelectList = null;
  }

  cancelForm() {
    this.searchForm.reset();
    this.clearTable();
    this.supSerial.nativeElement.focus();
  }

  onAddConsignee() {
    let consignee = new TbConsignee();
    this.onOpenSaveComponent.emit({mode:'add',obj:consignee});
  }

  onEditConsignee(TbConsignee: TbConsignee) {
    this.onOpenSaveComponent.emit({mode:'edit',obj:TbConsignee});
  }
  onDeleteConsignee() {
    if (this.tbConsigneeSelectList && this.tbConsigneeSelectList.length > 0) {
      this.Mmt1i030Service
        .deleteConsigneeList(this.tbConsigneeSelectList)
        .pipe(
          tap(res => {
            this.loading = true;
            this.onSearchConsignee();
            this.fwMsg.messageSuccess('ลบข้อมูลสำเร็จ');
          }
          ), catchError(
            err =>
              new Observable(() => {
                this.fwMsg.messageError('ไม่สามารถลบข้อมูลได้');
                this.loading = false;
                return;
              }))).subscribe();
      this.tbConsigneeSelectList = [];
    } else {
      this.fwMsg.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
    }
  }

  update(table) {
    table.reset();
  }

  onSearchConsignee() {
    this.searchTbConsignee(0, 100, true);
    this.update(this.table);
    this.tbConsigneeSelectList = [];
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      this.offset = event.first;
      this.limit = event.rows;
      this.searchTbConsignee(this.offset, this.limit, false);
    }
  }

  private searchTbConsignee(offset: number, limit: number, onClickSearch: boolean) {
    this.searchBtnClick = true;
    this.loading = true;
    let payload: TbConsignee = this.fwMsg.copy(this.searchForm.getRawValue(), new TbConsignee);
    payload = this.fwMsg.append(payload, { offset, limit });

    //count
    this.Mmt1i030Service
      .getCountConsignee(payload)
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

    this.Mmt1i030Service
      .getConsignee(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.tbConsigneeList = res;
          this.tbConsigneeList.forEach(value => {
            value.isFzDesc = (value.isFz != null ? this.fzConstant.IZ_SZ_FLAG_MAP.get(value.isFz.toString()) : null);
      });
          if (onClickSearch) {
            this.totalRecords = this.tbConsigneeList.length;
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

  onSaveSuccess(mode:string) {
    this.loading = true;
    if(mode=="add"){
      this.onSearchConsignee();
    }else{
      this.searchTbConsignee(this.offset, this.limit, false);
    }
  }
}
