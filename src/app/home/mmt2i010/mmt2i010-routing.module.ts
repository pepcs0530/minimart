import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Mmt2i010Component } from './mmt2i010.component';
import { SearchComponent } from './search/search.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: Mmt2i010Component,
    children: [
      /* { path: '', redirectTo: 'search', pathMatch: 'full' }, */
      { path: '', component: SearchComponent },
      { path: 'add', component: AddComponent },
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
export class Mmt2i010RoutingModule { }
