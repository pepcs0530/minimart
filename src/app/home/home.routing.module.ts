import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppModule } from '../app.module';
import { SaveComponent } from './save/save.component';
import { ReportComponent } from './report/report.component';

import { Mmt1i010Component } from './mmt1i010/mmt1i010.component';
import { Mmt1i020Component } from './mmt1i020/mmt1i020.component';
import { Mmt1i030Component } from './mmt1i030/mmt1i030.component';
import { Mmt1i040Component } from './mmt1i040/mmt1i040.component';
import { Mmt1i050Component } from './mmt1i050/mmt1i050.component';
import { Mmt1i060Component } from './mmt1i060/mmt1i060.component';

import { Tab0i010Component } from './tab/tab0i010/tab0i010.component';
import { Tab0i020Component } from './tab/tab0i020/tab0i020.component';
import { Tab0i030Component } from './tab/tab0i030/tab0i030.component';

const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },

  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'mmt2i010',
    loadChildren: './mmt2i010/mmt2i010.module#Mmt2i010Module'
  },
  {
    path: 'mmt2i020',
    loadChildren: './mmt2i020/mmt2i020.module#Mmt2i020Module'
  },
  { path: 'report', component: ReportComponent },
  { path: 'save', component: SaveComponent },
  { path: 'mmt1i010', component: Mmt1i010Component },
  { path: 'mmt1i020', component: Mmt1i020Component },
  { path: 'mmt1i030', component: Mmt1i030Component },
  { path: 'mmt1i060', component: Mmt1i060Component },
  { path: 'mmt1i040', component: Mmt1i040Component },
  { path: 'mmt1i050', component: Mmt1i050Component },
  { path: 'tab0i010', component: Tab0i010Component },
  { path: 'tab0i020', component: Tab0i020Component },
  { path: 'tab0i030', component: Tab0i030Component },
  // { path: '', redirectTo: '/home/dashboard' }

  /*
  { path: 'sample', component: SampleDemoComponent },
  { path: 'forms', component: FormsDemoComponent },
  { path: 'data', component: DataDemoComponent },
  { path: 'panels', component: PanelsDemoComponent },
  { path: 'overlays', component: OverlaysDemoComponent },
  { path: 'menus', component: MenusDemoComponent },
  { path: 'messages', component: MessagesDemoComponent },
  { path: 'misc', component: MiscDemoComponent },
  { path: 'empty', component: EmptyDemoComponent },
  { path: 'charts', component: ChartsDemoComponent },
  { path: 'file', component: FileDemoComponent },
  { path: 'utils', component: UtilsDemoComponent },
  { path: 'documentation', component: DocumentationComponent }
  */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
