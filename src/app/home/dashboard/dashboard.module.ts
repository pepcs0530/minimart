import { NgModule } from '@angular/core';
import { HomeModule } from '../home.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        HomeModule,
        DashboardRoutingModule
    ],
    declarations: [
        DashboardComponent
    ],
    providers: []
})
export class DashboardModule {}
