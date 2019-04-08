import { Component, OnInit, NgModule, Input } from '@angular/core';

import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { CountryService } from 'src/app/_services/country.service';
import { ReportOption } from '@models/report/report-option';
import { ReportType } from '@enum/report-type.enum';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Message } from 'primeng/components/common/api';
import { ArmtAddSurveyDetModel } from 'src/app/home/models/armt-survey-det-model';
import { SaveService } from 'src/app/_services/save.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import {CarService} from './service/carservice';
import {CarService} from '../../demo/service/carservice';
import {Car} from '../../demo/domain/car';
import {FwMenu} from '../models/fw-menu/fw-menu';

import { FwMenuService } from 'src/app/_services/fwmenu.service';


@Component({
    selector: 'edit-component-form',
    templateUrl: './edit.component.html'
})
export class EditComponent extends FactoryService  implements OnInit {

  
   
    constructor(private carService: CarService,private countryService: CountryService,
      private formBuilder: FormBuilder,
      private saveService: SaveService,
      private fwMenuService:FwMenuService) {
      super();
    }


    ngOnInit() { 

      
    }

    
}
