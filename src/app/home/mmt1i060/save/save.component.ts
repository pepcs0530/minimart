import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i060Service } from 'src/app/_services/mmt1i060.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i060SearchComponent } from '../search/search.component';
import { DatepickerComponent } from '../../datepicker/datepicker.component';
import { TbUnit } from '../../models/tb-unit';
import { setFormatCurrency } from 'src/app/shared/utils/setFormatCurrency';

@Component({
    selector: 'mmt1i060-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i060.component.css']
})
export class Mmt1i060SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    
    saveForm: FormGroup;
    weightFlag: Boolean ;
    tbUnitList: TbUnit[];
    byrfzIdList: any[];
    byrProvinceList: any[];
    lableTextField: string;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;
    submitted: boolean = false;

    @ViewChild('supSerial') supSerial: ElementRef;
    @ViewChild('byrSerial') byrSerial: ElementRef;
    

    private ConsigneeFromSearch: TbUnit;
    constructor(private formBuilder: FormBuilder, private Mmt1i060Service: Mmt1i060Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            unitCode: [null, Validators.required],
            unitNameEng: [null, Validators.required],
            unitNameTh: [null],
            unitPpl: [null],
            unitPkg: [null],
            unitSerial: [null],
            weightFlag: true,
 
            // byrFax: [null],
            // byrMobile: [null],
            // byrNameEng: [null],
            // byrNameTh: [null],
            // byrPhone: [null],
            // byrPostcode: [null],
            // byrPplno: [null],
            // byrProvinceId: [null],
            // byrTumbon: [null],
            // byrbranchCode: [null],
            // byrbranchName: [null],
            // byrbusinessId: [null],
            // byrcountryId: [null],
            // byrfzId: [null],
            // byrplantId: [null],
            // byrstsId: [null],
            // byrtaxId: [null],
            // byrtaxIncentive: [null],
            // dayStart: [null],
            // orderDays: [null],
            // orderForm: [null],
            // byrTumbon: [null],
            // byrAddr: [null]
        });
        // this.Mmt1i060Service.getMenuName().subscribe(res => this.byrStsCodeList = res);
        // this.Mmt1i060Service.getMenuName().subscribe(res => this.byrCountryCodeList = res);

        // this.Mmt1i060Service.getSupSerialList().subscribe(res => this.supSerialList = res);
        // this.Mmt1i060Service.getbyrSerialList().subscribe(res => this.byrSerialList = res);
        // this.Mmt1i060Service.getMBusiness().subscribe(res => this.byrBusinessIdList = res);
        // this.Mmt1i060Service.getMProvince().subscribe(res => this.byrProvinceList = res);
        // this.saveForm.value.orderForm == 'val1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
    }

    onClick(e){
        
    }
    onOpenSaveComponent(jsonObj) {
        // alert('--onOpenSaveComponent--');
        this.tabIndex = 0;
        this.ConsigneeFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.cancelForm();
        if(this.mode == 'edit'){
            this.setBeanToForm(this.ConsigneeFromSearch);
        }
      
    }

    handleChange(e) {
        // console.log('e.index===>',e.index);
        this.tabIndex = e.index;
    }

    setBeanToForm(tbUnit: TbUnit) {
        //alert('--setBeanToForm--');
        this.saveForm.get('unitCode').setValue(tbUnit.unitCode);
        this.saveForm.get('unitNameEng').setValue(tbUnit.unitNameEng);
        this.saveForm.get('unitNameTh').setValue(tbUnit.unitNameTh);
        this.saveForm.get('unitPkg').setValue(tbUnit.unitPkg);
        this.saveForm.get('unitPpl').setValue(tbUnit.unitPpl);
        this.saveForm.get('weightFlag').setValue(tbUnit.weightFlag == '1' ? true :false  );
        this.saveForm.get('unitSerial').setValue(tbUnit.unitSerial);
        
    }

    onShow() {
        // this.supSerial.nativeElement.focus();
    }

    tbUnitSave() {
        this.submitted = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.saveForm.invalid  || this.saveForm.value.unitNameEng == null ) {
            // this.fwMsg.messageError('กรุณากรอกข้อมูลให้ครบถ้วน');
        } else {
            // const byrNameTh = this.saveForm.value.byrNameTh;
            let payload: TbUnit = this.fwMsg.copy(this.saveForm.getRawValue(), new TbUnit);
            if (this.mode == 'add') {
                const createBy = currentUser.userInfo.userId;
                const updateBy = currentUser.userInfo.userId;
                const weightFlag  = (payload.weightFlag ? '1':'0');

                const unitPkg = this.saveForm.get('unitPkg').value ? setFormatCurrency(this.saveForm.get('unitPkg').value) : null;
              
                payload = this.fwMsg.append(payload, { weightFlag, createBy , updateBy , unitPkg
                  });
                this.Mmt1i060Service.addUnit(payload).pipe(tap(res => {
                    this.mode = 'edit';
                     this.visibleDialog = false;
                    this.saveForm.get('unitSerial').setValue(res.unitSerial);
                    // this.onSaveSuccess.emit('success')
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                    this.visibleDialog = false;
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err.data);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            } else {
                const updateBy = currentUser.userInfo.userId;
                const weightFlag  = (payload.weightFlag ? '1':'0');

                const unitPkg = this.saveForm.get('unitPkg').value ? setFormatCurrency(this.saveForm.get('unitPkg').value) : null;
                payload = this.fwMsg.append(payload, {weightFlag,
                    updateBy, unitPkg
                  });
                this.Mmt1i060Service.editUnit(payload).pipe(tap(res => {
                    //  this.visibleDialog = false;
                    // this.onSaveSuccess.emit('success')
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err.data);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            }
        }
    }



    cancelForm() {
        this.submitted = false;
        this.saveForm.reset();
        if (this.mode === 'add') {
            this.saveForm.reset();
            this.lableTextField = 'เพิ่มข้อมูลหน่วยสินค้า';
        
            // this.saveForm.get('orderForm').setValue('1');
        } else {
            this.lableTextField = 'แก้ไขข้อมูลหน่วยสินค้า';
            this.setBeanToForm(this.ConsigneeFromSearch);
        }
        // this.setDisableOrder();
    }

    // setDisableOrder() {
    //     this.saveForm.value.orderForm == '1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
    // }

}
