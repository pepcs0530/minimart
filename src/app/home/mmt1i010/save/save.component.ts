import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i010Service } from 'src/app/_services/mmt1i010.service';
import { TbBuyer } from '../../models/tb-buyer';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i010SearchComponent } from '../search/search.component';

@Component({
    selector: 'mmt1i010-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i010.component.css']
})
export class Mmt1i010SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    saveForm: FormGroup;
    byrStsIdList: any[];
    byrCountryIdList: any[];
    byrBusinessIdList: any[];
    byrfzIdList: any[];
    byrProvinceList: any[];
    lableTextField: string;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;
    submitted :boolean = false;

    @ViewChild('byrCode') byrCode: ElementRef;

    private buyerFromSearch: TbBuyer;
    constructor(private formBuilder: FormBuilder, private mmt1i010Service: Mmt1i010Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            byrSerial: [null],
            byrAddr1: [null],
            byrAmphur: [null],
            byrCode: [null,Validators.required],
            byrFax: [null],
            byrMobile: [null],
            byrNameEng: [null,Validators.required],
            byrNameTh: [null,Validators.required],
            byrPhone: [null],
            byrPostcode: [null],
            byrPplno: [null],
            byrProvinceId: [null],
            byrTumbon: [null],
            byrbranchCode: [null],
            byrbranchName: [null],
            byrbusinessId: [null],
            byrcountryId: [null],
            byrfzId: [null],
            byrplantId: [null],
            byrstsId: [null],
            byrtaxId: [null],
            byrtaxIncentive: [null],
            dayStart: [null],
            orderDays: [null],
            orderForm: [null],
            byrAddr: [null]
        });
        // this.mmt1i010Service.getMenuName().subscribe(res => this.byrStsCodeList = res);
        // this.mmt1i010Service.getMenuName().subscribe(res => this.byrCountryCodeList = res);

        this.mmt1i010Service.getMsts().subscribe(res => this.byrStsIdList = res);
        this.mmt1i010Service.getMCountry().subscribe(res => this.byrCountryIdList = res);
        this.mmt1i010Service.getMFreezone().subscribe(res => this.byrfzIdList = res);
        this.mmt1i010Service.getMBusiness().subscribe(res => this.byrBusinessIdList = res);
        this.mmt1i010Service.getMProvince().subscribe(res => this.byrProvinceList = res);
        // this.saveForm.value.orderForm == 'val1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
    }

    onOpenSaveComponent(jsonObj) {
        this.tabIndex = 0;
        this.buyerFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.cancelForm();
        this.setBeanToForm(this.buyerFromSearch);
    }

    handleChange(e) {
        this.tabIndex = e.index;
    }

    setBeanToForm(buyer: TbBuyer) {

        console.log('buyer.byrNameEng==>', buyer.byrNameEng);
        console.log('buyer.byrNameTh==>', buyer.byrNameTh);
        console.log('buyer.byrCode==>', buyer.byrCode);
        console.log('buyer==>', buyer);
        this.saveForm.get('byrSerial').setValue(buyer.byrSerial);
        this.saveForm.get('byrCode').setValue(buyer.byrCode);
        this.saveForm.get('byrNameEng').setValue(buyer.byrNameEng);
        this.saveForm.get('byrNameTh').setValue(buyer.byrNameTh);
        this.saveForm.get('byrAddr1').setValue(buyer.byrAddr1);
        this.saveForm.get('byrAmphur').setValue(buyer.byrAmphur);
        this.saveForm.get('byrFax').setValue(buyer.byrFax);
        this.saveForm.get('byrMobile').setValue(buyer.byrMobile);
        this.saveForm.get('byrPhone').setValue(buyer.byrPhone);
        this.saveForm.get('byrPostcode').setValue(buyer.byrPostcode);
        this.saveForm.get('byrPplno').setValue(buyer.byrPplno);
        this.saveForm.get('byrProvinceId').setValue(buyer.byrProvinceId);
        this.saveForm.get('byrTumbon').setValue(buyer.byrTumbon);
        this.saveForm.get('byrbranchCode').setValue(buyer.byrbranchCode);
        this.saveForm.get('byrbranchName').setValue(buyer.byrbranchName);
        this.saveForm.get('byrbusinessId').setValue(buyer.byrbusinessId);
        this.saveForm.get('byrcountryId').setValue(buyer.byrcountryId);
        this.saveForm.get('byrfzId').setValue(buyer.byrfzId);
        this.saveForm.get('byrplantId').setValue(buyer.byrplantId);
        this.saveForm.get('byrstsId').setValue(buyer.byrstsId);
        this.saveForm.get('byrtaxId').setValue(buyer.byrtaxId);
        this.saveForm.get('byrtaxIncentive').setValue(buyer.byrtaxIncentive);
        this.saveForm.get('dayStart').setValue(buyer.dayStart);
        this.saveForm.get('orderDays').setValue(buyer.orderDays);
        this.saveForm.get('orderForm').setValue(buyer.orderForm);
    }

    onShow() {
        this.byrCode.nativeElement.focus();
    }

    tbBuyerSave() {
        this.submitted = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.saveForm.invalid) {
            const byrSerial = this.saveForm.value.byrSerial;
            const byrCode = this.saveForm.value.byrCode;
            const byrNameTh = this.saveForm.value.byrNameTh;
            const byrNameEng = this.saveForm.value.byrNameTh;
            let payload: TbBuyer = this.fwMsg.copy(this.saveForm.getRawValue(), new TbBuyer);
            if (this.mode === 'add') {
                const createBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    createBy
                });
                console.log('payload--->', payload);
                this.mmt1i010Service.addTbBuyer(payload).pipe(tap(res => {
                    this.mode = 'edit';
                    //  this.visibleDialog = false;
                    this.saveForm.get('byrSerial').setValue(res.byrSerial);
                    // this.onSaveSuccess.emit('success');
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                    this.visibleDialog = false;
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err.data);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            } else {
                const updateBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    updateBy
                });
                console.log('payload--->', payload);
                this.mmt1i010Service.editTbBuyer(payload).pipe(tap(res => {
                    //  this.visibleDialog = false;
                    // this.onSaveSuccess.emit('success');
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
            this.lableTextField = 'เพิ่มรายละเอียดผู้ซื้อ';
            this.saveForm.get('orderForm').setValue('1');
        } else {
            this.lableTextField = 'แก้ไขรายละเอียดผู้ซื้อ';
            this.setBeanToForm(this.buyerFromSearch);
        }
        this.onClickOrderForm();
    }

    onClickOrderForm() {
        console.log('test');
        if(this.saveForm.value.orderForm == '1'){
            this.saveForm.get('orderDays').disable()
            this.saveForm.get('orderDays').setValue(null);
        }else{
            this.saveForm.get('orderDays').enable();
        }
    }
}
