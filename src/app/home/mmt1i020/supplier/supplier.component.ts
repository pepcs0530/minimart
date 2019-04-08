import { Component, OnInit, ViewChild } from '@angular/core';
import { FwMessageComponent } from 'src/app/shared/components/fw-message/fw-message.component';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelpersService } from 'src/app/shared/services/helpers/helpers';
import { Mmt1i020Service } from 'src/app/_services/mmt1i020.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { TbSupplierProduct } from 'src/app/shared/models/tb-supplier-product/tb-supplier-product';
import { AutoComplete } from 'primeng/primeng';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class Mmt1i020SupplierComponent implements OnInit {

  supplierForm: FormGroup;
  tabIndex = 0;
  deptPk: number;
  supuseTypeList: any[];
  supuseTypeCheck: number;
  @ViewChild('fwMessage') fwMessage: FwMessageComponent;

  @ViewChild('tb') table: Table;
  cols: any[];
  tbSupplierProductList: TbSupplierProduct[];
  tbSupplierProductSelectList: TbSupplierProduct[];

  visibleAddSupplierProductDialog = false;
  AddSupplierProductForm: FormGroup;
  lovSupplierListForAdd: any[];
  lovSupplierSelectedListForAdd: any[];
  @ViewChild('lovTbSupplierListForAdd') lovTbSupplierListForAdd: AutoComplete;
  loading: Boolean = false;
  totalRecords: number;
  submitted = false;
  currentRows: number;

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    private mmt1i020Service: Mmt1i020Service,
    private helpers: HelpersService
    ) { }

  ngOnInit() {
    this.initForm();
    this.setSupplierForm();
  }

  initForm() {
    this.supplierForm = this.formBuilder.group({
      supCode : [null],
      supNameEng : [null],
      supNameTh : [null],
      suptaxIncentive : [null],
      suptaxId : [null],
      supbranchCode : [null],
      supbranchName : [null],
      supauthpplType : [null],
      supauthpplName : [null],
      supprodType : [null],
      supprodTypeName : [null],
      supdeliveryTag : [null],
      supdeliveryTagName : [null],
      supplantCode : [null],
      supuseFlag : [null],
      supuseFlagName : [null],
      supuseType : [null],
      supuseTypeName : [null],
      layoutName : [null],
      supregisN019 : [null],
      supregisBoi19 : [null],
      supregisBoippl : [null],
      suplayoutVers : [null],
      supreleasePort : [null],
      supreleasePortName : [null],
      supcargoPort : [null],
      supcargoPortName : [null],
      supstsFlag : [null],
      supAddr1 : [null],
      supTumbon : [null],
      supAmphur : [null],
      provinceDesc : [null],
      provinceNameEng : [null],
      supProvinceId : [null],
      supPostcode : [null],
      supPhone : [null],
      supMobile : [null],
      supFax : [null],
      supAddr1Th : [null],
      supTumbonTh : [null],
      supAmphurTh : [null],
    });

    this.AddSupplierProductForm = this.formBuilder.group({
      supplierProduct : [null],
    });

    this.mmt1i020Service.getMSupuseList().subscribe(res => this.supuseTypeList = res);
    

    this.cols = [
      { field: 'supCode', header: 'รหัสผู้ส่งออก' }
    ];
  }

  setSupplierForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.deptPk = currentUser.userInfo.deptPk;
    console.log('[deptPk] : ', this.deptPk);
    this.mmt1i020Service.getTbSupplierById(this.deptPk)
    .pipe(
      tap(res => {
        console.log('[res]setSupplierForm : ', res);
        this.supplierForm.patchValue({
          // รายละเอียดผู้ส่งออก
          supCode: res.results[0].supCode,
          supNameEng: res.results[0].supNameEng,
          supNameTh: res.results[0].supNameTh,
          suptaxIncentive: res.results[0].suptaxIncentive,
          suptaxId: res.results[0].suptaxId,
          supbranchCode: res.results[0].supbranchCode,
          supbranchName: res.results[0].supbranchName,
          supauthpplName: res.results[0].supauthpplName,
          supprodTypeName: res.results[0].supprodTypeName,
          supdeliveryTagName: res.results[0].supdeliveryTagName,
          supplantCode: res.results[0].supplantCode,
          supuseFlagName: res.results[0].supuseFlagName,
          supuseType: res.results[0].supuseType,
          supuseTypeName: res.results[0].supuseTypeName,
          supregisBoi19: res.results[0].supregisBoi19,
          supregisBoippl: res.results[0].supregisBoippl,
          supregisN019: res.results[0].supregisN019,
          layoutName: res.results[0].layoutName,
          supreleasePortName: res.results[0].supreleasePortName,
          supcargoPortName: res.results[0].supcargoPortName,
          supstsFlag: res.results[0].supstsFlag,

          // ที่อยู่บริษัทผู้ส่งออก(EN)
          supAddr1: res.results[0].supAddr1,
          supTumbon: res.results[0].supTumbon,
          supAmphur: res.results[0].supAmphur,
          provinceDesc: res.results[0].provinceDesc,
          provinceNameEng: res.results[0].provinceNameEng,
          supPostcode: res.results[0].supPostcode,
          supPhone: res.results[0].supPhone,
          supMobile: res.results[0].supMobile,
          supFax: res.results[0].supFax,

          // ที่อยู่บริษัทผู้ส่งออก(TH)
          supAddr1Th: res.results[0].supAddr1Th,
          supTumbonTh: res.results[0].supTumbonTh,
          supAmphurTh: res.results[0].supAmphurTh,
        });
        this.supuseTypeCheck = this.helpers.getValueFromAbstractControl(this.supplierForm.get('supuseType').value, 'supuseType');
        this.mmt1i020Service.getTbSupplierListForAdd(this.deptPk).subscribe(res => this.lovSupplierListForAdd = res);
      }), catchError(err => new Observable(() => {
        console.log('[err]setSupplierForm : ', err);
      }))
    ).subscribe();
  }

  handleChange(e) {
    this.tabIndex = e.index;
  }

  checkSelectSupuseType(supuseType: string) {
    //console.log('checkSelectSupuseType[supuseType] : ', supuseType);
    if (this.supplierForm.controls.supuseType.value != null) {
        if (this.supplierForm.controls.supuseType.value === supuseType) {
            return true;
        }
    }
    return false;
  }

  getLableSupregis() {
    let text: string;
    // console.log('getLableSupregis[supuseTypeList] : ', this.supuseTypeList);
    this.supuseTypeList.forEach(value => {
        if (this.supplierForm.controls.supuseType.value === value.supuseType) {
            text = value.supuseLabel1;
        }
    });
    return text;
  }

  onAddSupplierProduct() {
    this.visibleAddSupplierProductDialog = true;
  }

  onDeleteSupplierProduct(rowData) {

  }

  getLovTbSupplierListForAdd(event) {
    console.log('[event] : ', event.query);
    this.mmt1i020Service.getTbSupplierListForAdd(this.deptPk).subscribe(res => this.lovSupplierListForAdd = res);
    console.log('[lovList]', this.lovSupplierListForAdd);
    this.lovSupplierSelectedListForAdd = this.lovSupplierListForAdd;
    if (event.query) {
        this.lovSupplierSelectedListForAdd = this.lovSupplierListForAdd.filter(obj => obj.label.indexOf(event.query) !== -1);
        console.log('[lovSelected]', this.lovSupplierSelectedListForAdd);
        if (this.lovSupplierSelectedListForAdd.length === 0) {
          this.lovTbSupplierListForAdd.onClear.emit();
        }
    }
  }

  tbSupplierProductSave() {

  }

  cancelForm() {

  }


}
