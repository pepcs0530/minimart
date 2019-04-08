import { Component, OnInit } from '@angular/core';
import { CarService } from '../../demo/service/carservice';
import { EventService } from '../../demo/service/eventservice';
import { Car } from '../../demo/domain/car';
import { BreadcrumbService } from '../../_services/breadcrumb.service';
import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { CountryService } from 'src/app/_services/country.service';

//import { ReportOption } from '@libs/utils/models/report/report-option';
//import { ReportType } from '@libs/utils/enum/report-type.enum';


@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent  implements OnInit {


  //  reportTypeList: ReportOption[];


    province: any[];
    amphur: any[];
    tambon: any[];
    zipcode: string;

    cities: SelectItem[];

    cars: Car[];

    cols: any[];

    chartData: any;

    events: any[];

    selectedCity: any;

    selectedCar: Car;

    items: MenuItem[];

    header: any;

    constructor(private carService: CarService,
        private eventService: EventService,
        private breadcrumbService: BreadcrumbService,
        private countryService: CountryService) {
        this.breadcrumbService.setItems([
            { label: '' }
        ]);
    }

    ngOnInit() {
        this.countryService.getProvince().subscribe(res => this.province = res);

        //alert('report');

       

        //console.log('res==>',this.province);

        /*

                this.carService.getCarsSmall().then(cars => this.cars = cars);
                this.cols = [
                    { field: 'vin', header: 'Vin' },
                    { field: 'year', header: 'Year' },
                    { field: 'brand', header: 'Brand' },
                    { field: 'color', header: 'Color' }
                ];

                this.eventService.getEvents().then(events => {this.events = events; });
                this.cities = [];
                this.cities.push({label: 'Select City', value: null});
                this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
                this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
                this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
                this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
                this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});
                this.chartData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'First Dataset',
                            data: [65, 59, 80, 81, 56, 55, 40],
                            fill: false,
                            borderColor: '#FFC107'
                        },
                        {
                            label: 'Second Dataset',
                            data: [28, 48, 40, 19, 86, 27, 90],
                            fill: false,
                            borderColor: '#03A9F4'
                        }
                    ]
                };
                this.items = [
                    {label: 'Save', icon: 'ui-icon-check'},
                    {label: 'Update', icon: 'ui-icon-refresh'},
                    {label: 'Delete', icon: 'ui-icon-delete'}
                ];
                this.header = {
                    left: 'prev, next today',
                    center: 'title',
                    right: 'month, agendaWeek, agendaDay'
                }; */
    }


    getAmphur(provinceId: number) {
        this.countryService.getAmphur(provinceId).subscribe(res => {
            this.amphur = res;
            this.getTambon(res[0]['value']);
        });
    }

    getTambon(amphurId: number) {
        this.countryService.getTambon(amphurId).subscribe(res => {
            this.tambon = res;
            this.getZipCode(res[0]['value']);
        });
    }

    getZipCode(tambon: any) {
        console.log(tambon);
        this.zipcode = tambon['zipCode'];
    }
}
