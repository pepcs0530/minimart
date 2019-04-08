import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i050Service } from 'src/app/_services/mmt1i050.service';
import { TbPricecf } from '../../models/tb-pricecf';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i050SearchComponent } from '../search/search.component';
import { removeComma } from 'src/app/shared/utils/remove-comma';
import { addComma } from 'src/app/shared/utils/add-comma';
import { setFormatCurrency } from 'src/app/shared/utils/setFormatCurrency';

@Component({
    selector: 'mmt1i050-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i050.component.css']
})
export class Mmt1i050SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    supSerialList: any[];
    saveForm: FormGroup;
    partuseTypeList: any[];
    partNoList: any[];
    partWeightList: any[];
    partUnitList: any[];
    weightUnitList: any[];
    partFlagList: any[];
    showFlagList: any[];
    prodFlagList: any[];

    
    isDisable:boolean = false;

    lableTextField: string;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;
    submitted: boolean = false;

    @ViewChild('partCode') partCode: ElementRef;

    private productFromSearch: TbPricecf;
    constructor(private formBuilder: FormBuilder, private mmt1i050Service: Mmt1i050Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            pricecfSerial: [null],
            supSerial: [null, Validators.required],
            partNo: [null, Validators.required],
            priceUnit: [null, Validators.required],
            priceUnitx: [null],
            pricecfImpSeq: [null],
            pricecfImpSerial: [null],
            pricecfNo: [null, Validators.required],
            remark: [null],
            startDate: [null],
            endDate: [null],
        });
        this.mmt1i050Service.getPartUnitList().subscribe(res => this.partUnitList = res);
        this.mmt1i050Service.getSupSerialThList().subscribe(res => this.supSerialList = res);
        this.mmt1i050Service.getWeightUnitList().subscribe(res => this.partWeightList = res);
        this.mmt1i050Service.getPartFlagList().subscribe(res => this.partFlagList = res);
        this.mmt1i050Service.getWeightUnitList().subscribe(res => this.weightUnitList = res);
        this.mmt1i050Service.getShowFlagList().subscribe(res => this.showFlagList = res);
        this.mmt1i050Service.getProdFlagList().subscribe(res => this.prodFlagList = res);
        this.mmt1i050Service.getPartuseTypeList().subscribe(res => this.partuseTypeList = res);

    }

    onOpenSaveComponent(jsonObj) {
        this.tabIndex = 0;
        this.productFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.onCancel();
    }

    handleChange(e) {
        this.tabIndex = e.index;
    }

    setBeanToForm(tbPricecf: TbPricecf) {
        console.log('setBeanToForm-->', tbPricecf);
        this.saveForm.get('pricecfSerial').setValue(tbPricecf.pricecfSerial);
        this.saveForm.get('endDate').setValue(tbPricecf.endDate ? new Date(tbPricecf.endDate) : null);
        this.saveForm.get('partNo').setValue(tbPricecf.partNo);
        this.saveForm.get('priceUnit').setValue(tbPricecf.priceUnit);
        this.saveForm.get('priceUnitx').setValue(tbPricecf.priceUnitx);
        this.saveForm.get('pricecfImpSeq').setValue(tbPricecf.pricecfImpSeq);
        this.saveForm.get('pricecfImpSerial').setValue(tbPricecf.pricecfImpSerial);
        this.saveForm.get('pricecfNo').setValue(tbPricecf.pricecfNo);
        this.saveForm.get('remark').setValue(tbPricecf.remark);
        this.saveForm.get('startDate').setValue(tbPricecf.startDate ? new Date(tbPricecf.startDate) : null);
        this.saveForm.get('supSerial').setValue(tbPricecf.supSerial);
    }

    onShow() {
        // this.partCode.nativeElement.focus();
    }

    onSaveTbPricecf() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.submitted = true;
        if (!this.saveForm.invalid) {
            this.isDisable = true;
            let payload: TbPricecf = this.fwMsg.copy(this.saveForm.getRawValue(), new TbPricecf);
            if (this.mode === 'add') {
                const createBy = currentUser.userInfo.userId;
                const priceUnit = this.saveForm.get('priceUnit').value ? setFormatCurrency(this.saveForm.get('priceUnit').value) : null;
                payload = this.fwMsg.append(payload, {
                    priceUnit,
                    createBy
                });
                console.log('[payload] : ', payload);
                this.mmt1i050Service.addTbPricecf(payload).pipe(tap(res => {
                    this.mode = 'edit';
                    this.saveForm.get('pricecfSerial').setValue(res.pricecfSerial);
                    // this.onSaveSuccess('success');
                    // this.onSaveSuccess.emit('success');
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                    this.visibleDialog = false;
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            } else {
                const priceUnit = this.saveForm.get('priceUnit').value ? setFormatCurrency(this.saveForm.get('priceUnit').value) : null;
                const updateBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    priceUnit,
                    updateBy
                });
                console.log('[payload] : ', payload);
                this.mmt1i050Service.editTbPricecf(payload).pipe(tap(res => {
                    // this.onSaveSuccess('success');
                    // this.onSaveSuccess.emit('success');
                    this.onSaveSuccess.emit(this.mode);
                    this.fwMsg.messageSuccess('บันทึกข้อมูลสำเร็จ');
                }), catchError(err => new Observable(() => {
                    console.log('catchError--->', err);
                    this.fwMsg.messageError('ไม่สามารถบันทึกได้');
                }))).subscribe();
            }
            this.isDisable = false;
        }
    }

    onCancel() {
        this.submitted = false;
        this.saveForm.reset();
        if (this.mode === 'add') {
            this.saveForm.reset();
            this.lableTextField = 'เพิ่มรายละเอียดข้อมูลราคาสินค้า';
        } else {
            this.lableTextField = 'แก้ไขรายละเอียดข้อมูลราคาสินค้า';
            this.setBeanToForm(this.productFromSearch);
        }
    }

    validateNumber($event, form, id, precision, scale) {
        this.fwMsg.validateNumberField($event, form, id, precision, scale);
    }

    getLableSupregis() {
        let text: string;
        this.partuseTypeList.forEach(value => {
            if (this.saveForm.controls.partuseType.value == value.partuseType) {
                text = value.partuseLabel1;
            }
        });
        return text;
    }

    checkSelectSupuseType(partuseType: string) {
        if (this.saveForm.controls.partuseType.value != null) {
            if (this.saveForm.controls.partuseType.value == partuseType) {
                return true;
            }
        }
        return false;
    }

    /* onSaveSuccess(msg: string) {
        this.isDisable = false;
        this.visibleDialog = false;
      } */
}
