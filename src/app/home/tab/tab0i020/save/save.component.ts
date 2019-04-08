import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Tab0i020Service } from 'src/app/_services/tab0i020.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Tab0i020SearchComponent } from '../../tab0i020/search/search.component';
import { Province } from '../../../models/m-province';

@Component({
    selector: 'tab0i020-save',
    templateUrl: '../save/save.component.html',
    styleUrls: ['../tab0i020.component.css']
})
export class Tab0i020SaveComponent implements OnInit {

    @Input() fwMsg: FactoryService;
    @Output() onSaveSuccess: EventEmitter<string> = new EventEmitter();

    saveForm: FormGroup;
    mode: string;
    visibleDialog: boolean = false;
    tabIndex: number = 0;
    submitted :boolean = false;
    lableTextField:string;
    
    @ViewChild('byrCode') byrCode: ElementRef;
    private provinceFromSearch: Province;
    constructor(private formBuilder: FormBuilder, private tab0i020Service: Tab0i020Service) {
    }

    ngOnInit() {
        this.saveForm = this.formBuilder.group({
            tumbonId: [null],
            tumbonName: [null],
            zipCode:[null],
        });
        // this.mmt1i010Service.getMenuName().subscribe(res => this.byrStsCodeList = res);
        // this.mmt1i010Service.getMenuName().subscribe(res => this.byrCountryCodeList = res);

        // this.mmt1i010Service.getMsts().subscribe(res => this.byrStsIdList = res);
        // this.saveForm.value.orderForm == 'val1' ? this.saveForm.get('orderDays').disable() : this.saveForm.get('orderDays').enable();
    }

    onOpenSaveComponent(jsonObj) {
        // alert('--onOpenSaveComponent--');
        this.tabIndex = 0;
        this.provinceFromSearch = jsonObj.obj;
        this.visibleDialog = true;
        this.mode = jsonObj.mode;
        // this.cancelForm();
        // this.setBeanToForm(this.buyerFromSearch);
    }

    handleChange(e) {
        // console.log('e.index===>',e.index);
        this.tabIndex = e.index;
    }


    onShow() {
        this.byrCode.nativeElement.focus();
    }

    onCancel(){

    }

    onSearch(){

    }

    onSave(){

    }
    
    onDelete(){

    }
}
