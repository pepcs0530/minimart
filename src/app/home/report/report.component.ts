import { Component, OnInit } from '@angular/core';

import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { CountryService } from 'src/app/_services/country.service';
import { ReportOption } from '@models/report/report-option';
import { ReportType } from '@enum/report-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//import { ReportOption } from '@libs/utils/models/report/report-option';
//import { ReportType } from '@libs/utils/enum/report-type.enum';


@Component({
    templateUrl: './report.component.html'
})
export class ReportComponent  implements OnInit {

  registerForm1: FormGroup;
    reportTypeList: ReportOption[];


    province: any[];
    amphur: any[];
    tambon: any[];
    zipcode: string;

    cities: SelectItem[];

    

    items: MenuItem[];

    header: any;

    selectedReport: ReportType;


    myGroup: FormGroup;
   

    constructor(private countryService: CountryService, private formBuilder: FormBuilder) {
     
    }

    ngOnInit() {  
     // alert('report');


      this.registerForm1 = this.formBuilder.group({
        projObj:['',Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
       





        this. setReportOptions();
        this.selectedReport = this.reportTypeList.find(reportOpt => reportOpt.default).value;
    }

    setReportOptions() {
        this.reportTypeList = [
          {
            label: 'Microsoft Word',
            value: ReportType.WORD
          },
          {
            label: 'Microsoft Excel',
            value: ReportType.EXCEL
          },       
          
          {
            label: 'PDF',
            value: ReportType.PDF,
            default: true,
            isPreviewable: false
          }
        ];
      }

      printReport(){
         // alert('print');
      }

   
}
