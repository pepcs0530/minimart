import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Tab0i010Service } from 'src/app/_services/tab0i010.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { Province } from 'src/app/home/models/m-province';
import { TbSupplier } from 'src/app/home/models/tb-supplier';

@Component({
  selector: 'tab0i010-search',
  templateUrl: '../search/search.component.html',
  styleUrls: ['../tab0i010.component.css']
})
export class Tab0i010SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @ViewChild('tb') table: Table;
  @ViewChild('proviceCode') proviceCode: ElementRef;


  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  provinceList: TbSupplier[];
  provinceSelectList: TbSupplier[];

  constructor(private formBuilder: FormBuilder, private tab0i010Service: Tab0i010Service) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      provinceDesc: [null],
      provinceId: [null],
      provinceName:[null],
    });
    this.cols = [
      { field: 'provinceId', header: 'รหัสจังหวัด' },
      { field: 'provinceName', header: 'จังหวัด' },
      { field: 'provinceDesc', header: 'ภาค' },

      // { field: 'byrtaxId', header: 'TaxId' },
      // { field: 'byrbusinessId', header: 'รหัสสาขา' },
      // { field: 'byrProvinceId', header: 'จังหวัด' },
      // { field: 'byrPplno', header: 'รูปแบบ Order' }
    ];
  }
  update(table) {
    table.reset();
  }
  onSearchProvince() {
    //this.searchBtnClick = true;
    const offset = 0;
    const limit = 100;
    this.searchProvince(offset, limit, true);
    this.update(this.table);
    this.provinceSelectList = [];
  }


  clearTable() {
    this.totalRecords = 0;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      //alert('loadCarsLazy');
      const offset = event.first;
      const limit = event.rows;
      this.searchProvince(offset, limit, false);
    }
  }

  
    private searchProvince(offset: number, limit: number, onClickSearch: boolean) {
      this.searchBtnClick = true;
      this.loading = true;
      let payload: Province = this.fwMsg.copy(this.searchForm.getRawValue(), new Province);
      payload = this.fwMsg.append(payload, { offset, limit });
  
      this.tab0i010Service
        // .getBuyer(payload)
        // .pipe(
          // tap(res => {
          //   this.loading = false;
          //   this.tbBuyerList = res
          //   if (onClickSearch) {
          //     this.totalRecords = this.tbBuyerList.length;
          //   }
          // }
          // ), catchError(
          //   err =>
          //     new Observable(() => {
          //       console.log('catchError--->', err.data);
          //       this.loading = false;
          //       this.fwMsg.messageError('ไม่สามารถค้นหาได้');
          //     })
          // )
        // ).subscribe();
    }


    onCancel(){
      this.searchForm.reset();
      this.clearTable();
      this.proviceCode.nativeElement.focus();
    }

    onSearch(){

    }

    onAdd(){
      let province = new Province();
      this.onOpenSaveComponent.emit({ mode: 'add', obj: province });
    }

    onEdit(buyer: TbSupplier){

    }
    
    onDelete(){

    }

}
