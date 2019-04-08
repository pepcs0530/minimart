import { Component, OnInit } from '@angular/core';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { Mmt1i010Service } from 'src/app/_services/mmt1i010.service';

import { UserService } from '../../_services/user.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i010',
  templateUrl: './mmt1i010.component.html'
})

export class Mmt1i010Component extends FactoryService implements OnInit {

  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService
  ) {
    super();
  }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT1I010 : ตารางข้อมูลผู้ซื้อ (BUYER)',
        routerLink: 'home/mmt1i010'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt1i010'
      }
    ]);

    let payload;
    const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    const programId = 'MMT1I010';
    payload = this.append(payload, {
      userId,
      programId
    });
    console.log('payload===>', payload);
    this.userService.addLog(payload).subscribe();
  }
}
