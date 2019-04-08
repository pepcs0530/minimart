import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Mmt1i020Service } from 'src/app/_services/mmt1i020.service';
import { TbSupplier } from '../../models/tb-supplier';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Mmt1i020SearchComponent } from '../search/search.component';

@Component({
    selector: 'app-mmt1i020-save',
    templateUrl: 'save.component.html',
    styleUrls: ['../mmt1i020.component.css']
})
export class Mmt1i020SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    saveForm: FormGroup;
    supuseTypeList: any[];
    supauthpplTypeList: any[];
    supdeliveryTagList: any[];
    supuseFlagList: any[];
    suplayoutVersList: any[];
    supAreaPortList: any[];
    supProvinceList: any[];
    supprodTypeList: any[];

    lableTextField: string;
    mode: string;
    visibleDialog = false;
    tabIndex = 0;
    submitted = false;

    @ViewChild('supCode') supCode: ElementRef;

    private buyerFromSearch: TbSupplier;
    constructor(private formBuilder: FormBuilder, private mmt1i020Service: Mmt1i020Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            supSerial: [null],
            supAddr1: [null],
            supAddr1Th: [null],
            supAmphur: [null],
            supAmphurTh: [null],
            supCode: [null, Validators.required],
            supFax: [null],
            supMobile: [null],
            supNameEng: [null, Validators.required],
            supNameTh: [null, Validators.required],
            supPhone: [null],
            supPostcode: [null],
            supPplno: [null],
            supProvinceId: [null],
            supTumbon: [null],
            supTumbonTh: [null],
            supauthpplType: [null],
            supbranchCode: [null],
            supbranchName: [null],
            supcargoPort: [null],
            supdeliveryTag: [null],
            suplayoutVers: [null],
            supplantCode: [null],
            supprodType: [null],
            supregisBoi19: [null],
            supregisBoippl: [null],
            supregisN019: [null],
            supreleasePort: [null],
            supstsFlag: [null],
            suptaxId: [null],
            suptaxIncentive: [null],
            supuseFlag: [null],
            supuseType: [null]
        });
        this.mmt1i020Service.getMProvince().subscribe(res => this.supProvinceList = res);
        this.mmt1i020Service.getMSupuseList().subscribe(res => this.supuseTypeList = res);
        this.mmt1i020Service.getMDeliveryTagList().subscribe(res => this.supdeliveryTagList = res);
        this.mmt1i020Service.getMProdTypeList().subscribe(res => this.supprodTypeList = res);
        this.mmt1i020Service.getMUseFlagList().subscribe(res => this.supuseFlagList = res);
        this.mmt1i020Service.getMLayoutVersList().subscribe(res => this.suplayoutVersList = res);
        this.mmt1i020Service.getMAreaPortList().subscribe(res => this.supAreaPortList = res);
        this.mmt1i020Service.getMAuthpplTypeList().subscribe(res => this.supauthpplTypeList = res);
    }

    onOpenSaveComponent(jsonObj) {
        this.tabIndex = 0;
        this.buyerFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        this.cancelForm();
    }

    handleChange(e) {
        this.tabIndex = e.index;
    }

    setBeanToForm(tbSupplier: TbSupplier) {
        this.saveForm.get('supSerial').setValue(tbSupplier.supSerial);
        this.saveForm.get('supAddr1').setValue(tbSupplier.supAddr1);
        this.saveForm.get('supAddr1Th').setValue(tbSupplier.supAddr1Th);
        this.saveForm.get('supAmphur').setValue(tbSupplier.supAmphur);
        this.saveForm.get('supAmphurTh').setValue(tbSupplier.supAmphurTh);
        this.saveForm.get('supCode').setValue(tbSupplier.supCode);
        this.saveForm.get('supFax').setValue(tbSupplier.supFax);
        this.saveForm.get('supMobile').setValue(tbSupplier.supMobile);
        this.saveForm.get('supNameEng').setValue(tbSupplier.supNameEng);
        this.saveForm.get('supNameTh').setValue(tbSupplier.supNameTh);
        this.saveForm.get('supPhone').setValue(tbSupplier.supPhone);
        this.saveForm.get('supPostcode').setValue(tbSupplier.supPostcode);
        this.saveForm.get('supPplno').setValue(tbSupplier.supPplno);
        this.saveForm.get('supProvinceId').setValue(tbSupplier.supProvinceId);
        this.saveForm.get('supTumbon').setValue(tbSupplier.supTumbon);
        this.saveForm.get('supTumbonTh').setValue(tbSupplier.supTumbonTh);
        this.saveForm.get('supauthpplType').setValue(tbSupplier.supauthpplType);
        this.saveForm.get('supbranchCode').setValue(tbSupplier.supbranchCode);
        this.saveForm.get('supbranchName').setValue(tbSupplier.supbranchName);
        this.saveForm.get('supcargoPort').setValue(tbSupplier.supcargoPort);
        this.saveForm.get('supdeliveryTag').setValue(tbSupplier.supdeliveryTag);
        this.saveForm.get('suplayoutVers').setValue(tbSupplier.suplayoutVers);
        this.saveForm.get('supplantCode').setValue(tbSupplier.supplantCode);
        this.saveForm.get('supprodType').setValue(tbSupplier.supprodType);
        this.saveForm.get('supregisBoi19').setValue(tbSupplier.supregisBoi19);
        this.saveForm.get('supregisBoippl').setValue(tbSupplier.supregisBoippl);
        this.saveForm.get('supregisN019').setValue(tbSupplier.supregisN019);
        this.saveForm.get('supreleasePort').setValue(tbSupplier.supreleasePort);
        this.saveForm.get('supstsFlag').setValue(tbSupplier.supstsFlag);
        this.saveForm.get('suptaxId').setValue(tbSupplier.suptaxId);
        this.saveForm.get('suptaxIncentive').setValue(tbSupplier.suptaxIncentive);
        this.saveForm.get('supuseFlag').setValue(tbSupplier.supuseFlag);
        this.saveForm.get('supuseType').setValue(tbSupplier.supuseType);
    }

    onShow() {
        this.supCode.nativeElement.focus();
    }

    tbSupplierSave() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.submitted = true;
        if (!this.saveForm.invalid) {
            let payload: TbSupplier = this.fwMsg.copy(this.saveForm.getRawValue(), new TbSupplier);
            if (this.mode === 'add') {
                const createBy = currentUser.userInfo.userId;
                payload = this.fwMsg.append(payload, {
                    createBy
                });
                console.log('[payload] : ', payload);
                this.mmt1i020Service.addTbSupplier(payload).pipe(tap(res => {
                    console.log('[res] : ', res);
                    this.mode = 'edit';
                    // this.saveForm.get('byrSerial').setValue(res.supSerial);
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
                console.log('[payload] : ', payload);
                this.mmt1i020Service.editTbSupplier(payload).pipe(tap(res => {
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
            this.lableTextField = 'เพิ่มรายละเอียดผู้ส่งออก';
        } else {
            this.lableTextField = 'แก้ไขรายละเอียดผู้ส่งออก';
            this.setBeanToForm(this.buyerFromSearch);
        }
    }

    validateNumber($event , form, id , precision, scale) {
        this.fwMsg.validateNumberField($event , form , id, precision, scale);
    }

    getLableSupregis() {
        let text: string;
        this.supuseTypeList.forEach(value => {
            if (this.saveForm.controls.supuseType.value === value.supuseType) {
                text = value.supuseLabel1;
            }
        });
        return text;
    }

    checkSelectSupuseType(supuseType: string) {
        if (this.saveForm.controls.supuseType.value != null) {
            if (this.saveForm.controls.supuseType.value === supuseType) {
                return true;
            }
        }
        return false;
    }
}
