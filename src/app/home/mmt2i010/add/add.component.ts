import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelpersService } from 'src/app/shared/services/helpers/helpers';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Table } from 'primeng/table';
import { InvDorderImp } from 'src/app/shared/models/inv-dorder-imp';
import { LazyLoadEvent } from 'primeng/api';
import { Router } from '@angular/router';
import { Mmt2i010Service } from '../services/mmt2i010.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm: FormGroup;
  loading: Boolean = false;
  @ViewChild('tb') table: Table;
  invDorderImpList: InvDorderImp[];
  invDorderImpSelectList: InvDorderImp[];
  offset = 0;
  limit = 100;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    public router: Router,
    private mmt2i010Service: Mmt2i010Service,
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
      },
      {
          label: 'เพิ่ม',
          routerLink: 'home/mmt2i010/add'
    }]);

    this.addForm = this.formBuilder.group({
      supCodeName: [null],
      currentDate: [null],
      currentTime: [null],
      tbSupplier: [null],
      tbConsignee: [null],
      suplayoutVer: [null],
      tranFreezone: [null],
      supreleasePort: [null],
      supcargoPort: [null],
      countryId: [null],
      moneyId: [null],
      plantCode: [null],
      impFilename: [null],
      orderStatus: [null]
    });

    this.cols = [
      { field: 'ref', header: 'ref' },
      { field: 'supCode', header: 'รหัสผู้ส่งออก', style: {'text-align' : 'center'} },
      { field: 'impData', header: 'วันที่นำเข้าข้อมูล', style: {'text-align' : 'center'} },
      { field: 'cnt', header: 'จำนวนรายการ สมบูรณ์/ไม่สมบูรณ์', style: {'text-align' : 'center'} },
      { field: 'impFileName', header: 'ชื่อไฟล์', style: {'text-align' : 'center'} },
      { field: 'exportResult', header: 'Export รายงานผล', style: {'text-align' : 'center'} },
    ];
  }

  browserClick(event) {
    console.log('[browserClick] : ', event);
  }

  toAddPage() {
    this.router.navigate(['/home/mmt2i010/detail']);
  }

  loadCarsLazy(event: LazyLoadEvent) {
    /* if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.getFwUser(offset, limit, false);
    } */
  }
}
