import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i030Service } from 'src/app/_services/mmt1i030.service';
import { TbConsignee } from '../../models/tb-consignee';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i030SearchComponent } from '../search/search.component';
import { DatepickerComponent } from '../../datepicker/datepicker.component';


@Component({
    selector: 'mmt1i030-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i030.component.css']
})
export class Mmt1i030SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    
    byrSerialList: any[];
    supSerialList: any[];
    saveForm: FormGroup;
    byrStsIdList: any[];
    byrCountryIdList: any[];
    byrBusinessIdList: any[];

    tbConsigneeList: TbConsignee[];
    byrfzIdList: any[];
    byrProvinceList: any[];
    lableTextField: string;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;

    submitted: boolean = false;

    @ViewChild('supSerial') supSerial: ElementRef;
    @ViewChild('byrSerial') byrSerial: ElementRef;
    

    private ConsigneeFromSearch: TbConsignee;
    constructor(private formBuilder: FormBuilder, private Mmt1i030Service: Mmt1i030Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            supSerial: [null,Validators.required],
            byrSerial: [null,Validators.required],
            isFz: [null],
            consignSerial: [null],
            
            // byrAmphur: [null],
            // byrSerial: [null],
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
        // this.Mmt1i030Service.getMenuName().subscribe(res => this.byrStsCodeList = res);
        // this.Mmt1i030Service.getMenuName().subscribe(res => this.byrCountryCodeList = res);

        this.Mmt1i030Service.getSupSerialList().subscribe(res => this.supSerialList = res);
        this.Mmt1i030Service.getbyrSerialList().subscribe(res => this.byrSerialList = res);
        // this.Mmt1i030Service.getMBusiness().subscribe(res => this.byrBusinessIdList = res);
        // this.Mmt1i030Service.getMProvince().subscribe(res => this.byrProvinceList = res);
        // this.saveForm.value.orderForm == 'val1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
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

    setBeanToForm(TbConsignee: TbConsignee) {
        //alert('--setBeanToForm--');
        this.saveForm.get('supSerial').setValue(TbConsignee.supSerial);
        this.saveForm.get('byrSerial').setValue(TbConsignee.byrSerial);
        this.saveForm.get('isFz').setValue(TbConsignee.isFz);
        this.saveForm.get('consignSerial').setValue(TbConsignee.consignSerial);
    }

    onShow() {
        // this.supSerial.nativeElement.focus();
    }

    tbConsigneeSave() {
        this.submitted = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.saveForm.invalid){
            this.fwMsg.messageError('กรุณากรอกข้อมูลให้ครบถ้วน');
        } else {
            const supSerial = this.saveForm.value.supSerial;
            const byrSerial = this.saveForm.value.byrSerial;
            const isFz      = this.saveForm.value.isFz;
            // const byrNameTh = this.saveForm.value.byrNameTh;
            // const byrNameEng = this.saveForm.value.byrNameTh;
            let payload: TbConsignee = this.fwMsg.copy(this.saveForm.getRawValue(), new TbConsignee);
            if (this.mode === 'add') {
                const createBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    createBy
                  });
                this.Mmt1i030Service.addConsignee(payload).pipe(tap(res => {
                    this.onSaveSuccess.emit(this.mode);
                    this.mode = 'edit';
                    this.saveForm.get('consignSerial').setValue(res.consignSerial);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                    this.visibleDialog = false;
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            } else {
                const updateBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    updateBy, supSerial, byrSerial
                  });
                this.Mmt1i030Service.editConsignee(payload).pipe(tap(res => {
                    //  this.visibleDialog = false;
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err);
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
            this.lableTextField = 'เพิ่มรายละเอียดผู้รับ';
        
            // this.saveForm.get('orderForm').setValue('1');
        } else {
            this.lableTextField = 'แก้ไขรายละเอียดผู้รับ';
            // this.setBeanToForm(this.ConsigneeFromSearch);
        }
        // this.setDisableOrder();
    }

    // setDisableOrder() {
    //     this.saveForm.value.orderForm == '1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
    // }

}
