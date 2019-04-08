import { Component, OnInit } from '@angular/core';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { UserService } from 'src/app/_services/user.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i040',
  templateUrl: './mmt1i040.component.html'
})

export class Mmt1i040Component extends FactoryService implements OnInit {

  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService,
  ) {
    super();
  }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT1I040 : ตารางข้อมูลสินค้า (PRODUCT)',
        routerLink: 'home/mmt1i040'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt1i040'
      }
    ]);

    let payload;
    const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    const programId = 'MMT1I040';
    payload = this.append(payload, {
      userId,
      programId
    });
    console.log('payload===>', payload);
    this.userService.addLog(payload).subscribe();
  }
}
