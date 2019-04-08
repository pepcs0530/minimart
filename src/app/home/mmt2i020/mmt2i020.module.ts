import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Mmt2i020RoutingModule } from './mmt2i020-routing.module';
import { Mmt2i020Service } from './services/mmt2i020.service';
import { SearchComponent } from './search/search.component';
import { HomeModule } from '../home.module';
import { Mmt2i020Component } from './mmt2i020.component';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    HomeModule,
    Mmt2i020RoutingModule
  ],
  declarations: [
    Mmt2i020Component,
    SearchComponent,
    UploadComponent,
    DetailComponent
  ],
  providers: [
    Mmt2i020Service
  ]
})
export class Mmt2i020Module { }
