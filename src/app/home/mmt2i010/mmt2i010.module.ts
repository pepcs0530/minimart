import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Mmt2i010RoutingModule } from './mmt2i010-routing.module';
import { Mmt2i010Service } from './services/mmt2i010.service';
import { SearchComponent } from './search/search.component';
import { HomeModule } from '../home.module';
import { Mmt2i010Component } from './mmt2i010.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';
import { Inv1r010ReportComponent } from './inv1r010-report/inv1r010-report.component';

@NgModule({
  imports: [
    HomeModule,
    Mmt2i010RoutingModule
  ],
  declarations: [
    Mmt2i010Component,
    SearchComponent,
    AddComponent,
    DetailComponent,
    UploadComponent,
    Inv1r010ReportComponent
  ],
  providers: [
    Mmt2i010Service
  ]
})
export class Mmt2i010Module { }
