import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';

import { SelectItem, ConfirmDialog, Paginator } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { CountryService } from 'src/app/_services/country.service';
import { ReportOption } from '@models/report/report-option';
import { ReportType } from '@enum/report-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message, LazyLoadEvent } from 'primeng/components/common/api';
import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';
import { SaveService } from 'src/app/_services/save.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import {CarService} from './service/carservice';
import {CarService} from '../../demo/service/carservice';
import {Car} from '../../demo/domain/car';
import {FwMenu} from '../models/fw-menu/fw-menu';

import { FwMenuService } from 'src/app/_services/fwmenu.service';
import { Table } from 'primeng/table';
FwMenuService



//import { ReportOption } from '@libs/utils/models/report/report-option';
//import { ReportType } from '@libs/utils/enum/report-type.enum';
//import { MaterialModule } from '../../shared/component/material.module';
//import { DatePickerModule } from 'angular-material-datepicker';


@Component({
    templateUrl: 'save.component.html',
    styleUrls: ['save.component.css']
})
export class SaveComponent extends FactoryService  implements OnInit {

  saveForm: FormGroup;
  addMenuForm: FormGroup;
  reportTypeList: ReportOption[];

  @ViewChild('tb') table: Table;

    myDate = new Date();
    startDate = new Date(1990, 0, 1);

    //@Input()
   // matDatepicker: MatDatepicker();
   
   submitted = false;
   msgs: Message[] = [];

   visibleError: Boolean = false;

   visibleEdit: Boolean = false;
   visibleNew: Boolean = false;

   loading: Boolean = false;

   

   checkout: any[];

    province: any[];
    amphur: any[];
    tambon: any[];
    menuNameList: any[];
    zipcode: string;

    cities: SelectItem[];

    value: Date;
    picker: Date;
    es: any;

    items: MenuItem[];

    header: any;


    myGroup: FormGroup;

    loadingDialog = false;
   
    selectedCar: Car;
    cars1: Car[];
    data: any[];
    data2: any[];
    selectedItems: any[];
    cols: any[];
    cols2: any[];
   

    fwMenu: FwMenu[];
    selectedDataMenu: FwMenu[];

    totalRecords: number;
    searchBtnClick : boolean = false;
    pagingIndex: number;


    constructor(private carService: CarService,private countryService: CountryService,
      private formBuilder: FormBuilder,
      private saveService: SaveService,
      private fwMenuService:FwMenuService) {
      super();
    }

    ngOnInit() {  
      this.saveForm = this.formBuilder.group({
        //ebcsFwMenuPk:[null],  
        fwMenuPk:[null],    
        startDate: ['',Validators.required],
        menuName:[null],
        menuId:[null],
        menuNameListValue:[null],
    });       

    this.addMenuForm = this.formBuilder.group({
      ebcsFwMenuPk:[null],      
      startDate: [null],
      menuName:[null],
      menuId:[null],
  }); 
    
      this.data = [];   
      this.selectedItems = [];  

      this.cols = [
        { field: 'fwMenuPk', header: 'ID' },      
        { field: 'menuSeq', header: 'MenuSeq' },
       
        { field: 'menuId', header: 'MenuId' },
        { field: 'menuName', header: 'MenuName' }        
      ];    
      
      this.fwMenuService.getMenuName().subscribe(res => this.menuNameList = res);

  }

      getFwMenu(){

        //alert('---getFwMenu----');

        this.searchBtnClick = true;   
        console.log('menuName===>', this.saveForm.value['menuName']);
        console.log('menuId===>', this.saveForm.value['menuId']);
        console.log('startDate===>', this.saveForm.value['startDate']);

        //console.log('menuNameListValue==>',this.saveForm.value['menuNameListValue']);
        const startDate = new Date(this.saveForm.get('startDate').value);

        const offset = 0;
        const limit = 100;
        let payload: FwMenu = this.copy(
          this.saveForm.getRawValue(),
          new FwMenu
        );
        console.log('before payload===>',payload);
        payload = this.append(payload, {
          startDate,  
          offset,
          limit        
        });
        console.log('after payload===>',payload);        

      this.loading = true;

      this.fwMenuService
      .getFwMenu(payload)  
      .pipe(
        tap(res=>{
         
          //this.messageSuccess('บันทึกสำเร็จ');
          
          this.loading = false;          
          this.fwMenu = res    
          this.totalRecords = this.fwMenu.length;     
          
          
        }
        ),catchError(
          err =>
            new Observable(() => {                  
               console.log('catchError--->', err.data);
             this.messageError('ไม่สามารถค้นหาได้');
            })
      )
      )
      .subscribe();
      
     // this.resetTable();
     this.update(this.table);
     this.selectedDataMenu = []; 

      }

      clearMessage(){
        this.close();
      }

      update(table){         
        table.reset();
      }

      selectRowMenu(fwMenu: FwMenu) {

        //alert('aaaa');

       // console.log(fwMenu.ebcsFwMenuPk);
        this.saveForm.get('menuName').setValue(fwMenu.menuName);
        this.saveForm.get('menuId').setValue(fwMenu.menuId);
        //this.saveForm.get('ebcsFwMenuPk').setValue(fwMenu.ebcsFwMenuPk);
        this.saveForm.get('fwMenuPk').setValue(fwMenu.fwMenuPk);
        this.visibleEdit =true;
       // this.messageInfo('menuId=>'+fwMenu.menuId+'  menuName=>'+fwMenu.menuName);
      }

      clearTable(){  
        this.fwMenu = []; 
        this.totalRecords = 0;     
        }  

      // saveEdit(fwMenu: FwMenu){
        saveEdit(){
      //  alert('saveEdit');
        
        //console.log(registerForm1.ebcsFwMenuPk);
        
         let menuName = this.saveForm.get('menuName').value;

        let payload: FwMenu = this.copy(
          this.saveForm.getRawValue(),
          new FwMenu
        );

        payload = this.append(payload, {         
          menuName,
        });

        console.log('payload===>',payload);

        this.fwMenuService
        .editFwMenu(payload)  
        .pipe(
          tap(res=>{
          
            //alert('บันทึกสำเร็จ');
            this.getFwMenu();
            this.messageSuccess('บันทึกข้อมูลสำเร็จ');
            this.loading = false;          
                  
          }
          ),catchError(
            err =>
              new Observable(() => {                  
                console.log('catchError--->', err.data);
              this.messageError('ไม่สามารถบันทึกได้');
              })
        )
        )
        .subscribe();     

      }

      addSaveMenu(){
        //alert('saveNew');
        console.log('menuName===>', this.addMenuForm.value['menuName']);
        console.log('menuId===>', this.addMenuForm.value['menuId']);


        let menuName = this.addMenuForm.get('menuName').value;
        let menuId = this.addMenuForm.get('menuId').value;

        let payload: FwMenu = this.copy(
          this.addMenuForm.getRawValue(),
          new FwMenu
        );

        payload = this.append(payload, {         
          menuName,
          menuId
        });

        console.log('Newpayload====>',payload);

        this.fwMenuService
        .addFwMenu(payload)  
        .pipe(
          tap(res=>{
          
            //alert('บันทึกสำเร็จ');
            this.getFwMenu();
            this.messageSuccess('บันทึกข้อมูลสำเร็จ');
            this.loading = false;          
                  
          }
          ),catchError(
            err =>
              new Observable(() => {                  
                console.log('catchError--->', err.data);
              this.messageError('ไม่สามารถบันทึกได้');
              })
        )
        )
        .subscribe();   

      }

      deleteMenu(){        
        if (this.selectedDataMenu && this.selectedDataMenu.length > 0) {
          this.selectedDataMenu.forEach(file => {
           // console.log('file====>',file.ebcsFwMenuPk);
            this.loading = true;
            //this.fwMenuService.deleteFwMenu(file.ebcsFwMenuPk);     
            this.fwMenuService
            .deleteFwMenu(file.fwMenuPk)  
            .pipe(
              tap(res=>{
                this.getFwMenu();
                this.messageSuccess('ลบข้อมูลสำเร็จ');
                this.update(this.table);
              }
              ),catchError(
                err =>
                  new Observable(() => {                  
                    console.log('catchError--->', err.data);
                    
                  this.messageError('ไม่สามารถลบข้อมูลได้');
                  this.loading = false;  
                  return;
                  })
            )            
            )            
            .subscribe();    
          
          });

          this.selectedDataMenu = [];       

         
        }else{
         // this.messageWarning('เลือกข้อมูลที่ต้องการลบก่อน');
        }
      }

      loadCarsLazy(event: LazyLoadEvent) {

        
        if(this.searchBtnClick){

          this.loading = true;
          console.log('event.first==>',event.first);
          console.log('event.rows==>',event.rows);
          console.log('menuName===>', this.saveForm.value['menuName']);
          console.log('menuId===>', this.saveForm.value['menuId']);
          console.log('startDate===>', this.saveForm.value['startDate']);
          //console.log('menuNameListValue==>',this.saveForm.value['menuNameListValue']);  
          const startDate = new Date(this.saveForm.get('startDate').value);
          const startDate2 = new Date(this.saveForm.get('startDate').value);
          const offset = event.first;
          const limit = event.rows;
          console.log('offset==>',offset);
          console.log('limit==>',limit);
  
          let payload: FwMenu = this.copy(
            this.saveForm.getRawValue(),
            new FwMenu
          );
          console.log('before payload===>',payload);
          payload = this.append(payload, {
            startDate,  
            startDate2,  
            offset,
            limit,         
          });
          console.log('after payload===>',payload);         
  
        this.loading = true;
        this.fwMenuService
        .getFwMenu(payload)  
        .pipe(
          tap(res=>{         
            //this.messageSuccess('บันทึกสำเร็จ');
            this.loading = false;          
            this.fwMenu = res    
            //this.totalRecords = this.fwMenu.length;      
          }
          ),catchError(
            err =>
              new Observable(() => {                  
                 console.log('catchError--->', err.data);
               this.messageError('ไม่สามารถค้นหาได้');
              })
        )
        )
        .subscribe(); 
        }

        setTimeout(() => {
          this.loading = false;
      }, 1000);

    }


      openSaveMenu(){
        this.visibleNew =true;
      }


      searchMenu() {
     //   alert('aaaa');
        this.submitted = true;
        // stop here if form is invalid
        if (this.saveForm.invalid) {
            return;
        }else{
          this.getFwMenu();
        }      
       
    }

    get f() {
       return this.saveForm.controls; 
    }

}
