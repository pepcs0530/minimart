import { Component, OnInit } from '@angular/core';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { UserService } from 'src/app/_services/user.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i030',
  templateUrl: './mmt1i030.component.html'
})

export class Mmt1i030Component extends FactoryService implements OnInit {
  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService
  ) {
    super();
  }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT1I030 : ตารางข้อมูลอ้างอิงผู้ซื้อ (CONSIGNEE)',
        routerLink: 'home/mmt1i030'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt1i030'
      }
    ]);

    let payload;
    const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    const programId = 'MMT1I030';
    payload = this.append(payload, {
      userId,
      programId
    });
    console.log('payload===>', payload);
    this.userService.addLog(payload).subscribe();
  }
}
