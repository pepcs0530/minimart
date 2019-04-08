import { Component, OnInit, NgModule, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { Tab0i020Service } from 'src/app/_services/tab0i020.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Table } from 'primeng/table';
import { Tambon } from 'src/app/home/models/m-tambon';
import { TbSupplier } from 'src/app/home/models/tb-supplier';

@Component({
  selector: 'tab0i020-search',
  templateUrl: '../search/search.component.html',
  styleUrls: ['../tab0i020.component.css']
})
export class Tab0i020SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() fwMsg: FactoryService;
  @Output() onOpenSaveComponent = new EventEmitter();

  @ViewChild('tb') table: Table;
  // @ViewChild('byrCode') byrCode: ElementRef;

  tambonList: TbSupplier[];
  tambonSelectList: TbSupplier[];

  menuNameList: any[];
  loading: Boolean = false;
  totalRecords: number;
  searchBtnClick: boolean = false;
  pagingIndex: number;
  cols: any[];

  constructor(private formBuilder: FormBuilder, private tab0i020Service: Tab0i020Service) {
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      tambonId: [null],
      tambonName:[null],
      zipCode:[null],
    });
    this.cols = [
      { field: 'tambonId', header: 'รหัสตำบล' },
      { field: 'tambonName', header: 'ตำบล' },
      { field: 'zipCode', header: 'รหัสไปรษณีย์' },
      // { field: 'tambonDesc', header: 'ภาค' },

      // { field: 'byrtaxId', header: 'TaxId' },
      // { field: 'byrbusinessId', header: 'รหัสสาขา' },
      // { field: 'byrtambonId', header: 'จังหวัด' },
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
      this.searchtambon(offset, limit, false);
    }
  }
    private searchtambon(offset: number, limit: number, onClickSearch: boolean) {
      this.searchBtnClick = true;
      this.loading = true;
      let payload: Tambon = this.fwMsg.copy(this.searchForm.getRawValue(), new Tambon);
      payload = this.fwMsg.append(payload, { offset, limit });
  
      this.tab0i020Service
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
    let tambon = new Tambon();
    this.onOpenSaveComponent.emit({ mode: 'add', obj: tambon });
    }

    onEdit(buyer: TbSupplier){

    }
    
    onDelete(){

    }


}
