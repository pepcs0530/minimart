import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Tab0i030Service } from 'src/app/_services/tab0i030.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { Amphur } from 'src/app/home/models/m-amphur';
import { TbSupplier } from 'src/app/home/models/tb-supplier';

@Component({
  selector: 'tab0i030-search',
  templateUrl: '../search/search.component.html',
  styleUrls: ['../tab0i030.component.css']
})
export class Tab0i030SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @ViewChild('tb') table: Table;
  // @ViewChild('byrCode') byrCode: ElementRef;

  amphurList: TbSupplier[];
  amphurSelectList: TbSupplier[];
  
  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  constructor(private formBuilder: FormBuilder, private tab0i030Service: Tab0i030Service) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      amphurId: [null],
      amphurName:[null],
      amphurDesc:[null],
    });
    this.cols = [
      { field: 'amphurId', header: 'รหัสอำtเภอ' },
      { field: 'amphurName', header: 'อำเภอ' },
      { field: 'amphurDesc', header: 'อำเภอ..desc' },
      // { field: 'amphurDesc', header: 'ภาค' },

      // { field: 'byrtaxId', header: 'TaxId' },
      // { field: 'byrbusinessId', header: 'รหัสสาขา' },
      // { field: 'byramphurId', header: 'จังหวัด' },
      // { field: 'byrPplno', header: 'รูปแบบ Order' }
    ];
  }
  update(table) {
    table.reset();
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.searchBtnClick) {
      //alert('loadCarsLazy');
      const offset = event.first;
      const limit = event.rows;
      this.searchamphur(offset, limit, false);
    }
  }
    private searchamphur(offset: number, limit: number, onClickSearch: boolean) {
      this.searchBtnClick = true;
      this.loading = true;
      let payload: Amphur = this.fwMsg.copy(this.searchForm.getRawValue(), new Amphur);
      payload = this.fwMsg.append(payload, { offset, limit });
  
      this.tab0i030Service
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

    }

    onSearch(){

    }

    onAdd(){
      let amphur = new Amphur();
      this.onOpenSaveComponent.emit({ mode: 'add', obj: amphur });
    }

    onEdit(buyer: TbSupplier){

    }
    
    onDelete(){

    }

}
