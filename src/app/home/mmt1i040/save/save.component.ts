import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i040Service } from 'src/app/_services/mmt1i040.service';
import { TbProduct } from '../../models/tb-product';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i040SearchComponent } from '../search/search.component';

@Component({
    selector: 'mmt1i040-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i040.component.css']
})
export class Mmt1i040SaveComponent implements OnInit {

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

    lableTextField: string;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;
    submitted :boolean = false;

    @ViewChild('partCode') partCode: ElementRef;

    private productFromSearch: TbProduct;
    constructor(private formBuilder: FormBuilder, private mmt1i040Service: Mmt1i040Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            supSerial: [null,Validators.required],
            partNo: [null,Validators.required],
            partWeight: [null,Validators.required],
            partUnit: [null],
            weightUnit: [null],
            partFlag: [null],
            pplTariffNo: [null],
            showFlag: [null],
            prodFlag: [null],
            pplStaticCode: [null],
            pplTariffDesc: [null],
            pplTariffSeaq: [null],
            

            partUseType: [null],
            partUseNo1: [null],
            partUseNo2: [null],
            partUseDesc1: [null],
            partUseDesc2: [null],
            partUseDesc3: [null],
            
            partuseFlag: [null],
            partuseType: [null],
            prodSerial: [null],
            partNameEng: [null,Validators.required],
            partNameTh: [null,Validators.required],
            

        });
        this.mmt1i040Service.getPartUnitList().subscribe(res => this.partUnitList = res);
        this.mmt1i040Service.getSupSerialThList().subscribe(res => this.supSerialList = res);
        this.mmt1i040Service.getWeightUnitList().subscribe(res => this.partWeightList = res);
        this.mmt1i040Service.getPartFlagList().subscribe(res => this.partFlagList = res);
        this.mmt1i040Service.getWeightUnitList().subscribe(res => this.weightUnitList = res);
        this.mmt1i040Service.getShowFlagList().subscribe(res => this.showFlagList = res);
        this.mmt1i040Service.getProdFlagList().subscribe(res => this.prodFlagList = res);
        this.mmt1i040Service.getPartuseTypeList().subscribe(res => this.partuseTypeList = res);
        
    }

    onOpenSaveComponent(jsonObj) {
        this.tabIndex = 0;
        this.productFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.cancelForm();
    }

    handleChange(e) {
        this.tabIndex = e.index;
    }

    setBeanToForm(tbpartduct: TbProduct) {
        
        this.saveForm.get('prodSerial').setValue(tbpartduct.prodSerial);
        this.saveForm.get('supSerial').setValue(tbpartduct.supSerial);
        this.saveForm.get('partNo').setValue(tbpartduct.partNo);
        this.saveForm.get('partNameEng').setValue(tbpartduct.partNameEng);
        this.saveForm.get('partNameTh').setValue(tbpartduct.partNameTh);
        this.saveForm.get('partUnit').setValue(tbpartduct.partUnit);
        this.saveForm.get('partWeight').setValue(tbpartduct.partWeight);
        this.saveForm.get('partFlag').setValue(tbpartduct.partFlag);
        this.saveForm.get('weightUnit').setValue(tbpartduct.weightUnit);
        this.saveForm.get('pplTariffNo').setValue(tbpartduct.pplTariffNo);
        this.saveForm.get('pplStaticCode').setValue(tbpartduct.pplStaticCode);
        this.saveForm.get('prodFlag').setValue(tbpartduct.prodFlag);
        this.saveForm.get('showFlag').setValue(tbpartduct.showFlag);
        this.saveForm.get('pplTariffSeaq').setValue(tbpartduct.pplTariffSeq);
        this.saveForm.get('pplTariffDesc').setValue(tbpartduct.pplStaticCode);
        this.saveForm.get('partUseType').setValue(tbpartduct.partuseType);
        this.saveForm.get('partUseNo1').setValue(tbpartduct.partuseNo1);
        this.saveForm.get('partUseNo2').setValue(tbpartduct.partuseNo2);
        this.saveForm.get('partUseDesc1').setValue(tbpartduct.partuseDesc1);
        this.saveForm.get('partUseDesc2').setValue(tbpartduct.partuseDesc2);
        this.saveForm.get('partUseDesc3').setValue(tbpartduct.partuseDesc3);
    }

    onShow() {
        // this.partCode.nativeElement.focus();
    }

    tbProductSave() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.submitted = true;
        if (!this.saveForm.invalid) {
            let payload: TbProduct = this.fwMsg.copy(this.saveForm.getRawValue(), new TbProduct);
            if (this.mode === 'add') {
                const createBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    createBy
                });
                this.mmt1i040Service.addTbProduct(payload).pipe(tap(res => {
                    this.onSaveSuccess.emit(this.mode);
                    this.mode = 'edit';
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
                this.mmt1i040Service.editTbProduct(payload).pipe(tap(res => {
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
            this.lableTextField = 'เพิ่มรายละเอียดข้อมูลสินค้า';
        } else {
            this.lableTextField = 'แก้ไขรายละเอียดข้อมูลสินค้า';
            this.setBeanToForm(this.productFromSearch);
        }
    }

    validateNumber($event , form, id , precision, scale) {
        this.fwMsg.validateNumberField($event , form , id, precision, scale);
    }

    getLableSupregis(){
        let text:string;
        this.partuseTypeList.forEach(value => {
            if(this.saveForm.controls.partuseType.value == value.partuseType){
                text = value.partuseLabel1;
            }
        });
        return text;
    }

    checkSelectSupuseType(partuseType:string){
        if(this.saveForm.controls.partuseType.value != null){
            if(this.saveForm.controls.partuseType.value == partuseType){
                return true;
            }
        }
        return false;
    }
}
