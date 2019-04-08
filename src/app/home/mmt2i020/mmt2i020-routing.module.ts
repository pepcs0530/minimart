import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Mmt2i020Component } from './mmt2i020.component';
import { SearchComponent } from './search/search.component';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: Mmt2i020Component,
    children: [
      { path: '', component: SearchComponent },
      { path: 'detail', component: DetailComponent },
      { path: 'upload', component: UploadComponent },
      { path: '**', component: SearchComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Mmt2i020RoutingModule { }
