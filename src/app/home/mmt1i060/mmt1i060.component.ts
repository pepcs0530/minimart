import { Component, OnInit } from '@angular/core';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { UserService } from 'src/app/_services/user.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i060',
  templateUrl: './mmt1i060.component.html'
})

export class Mmt1i060Component extends FactoryService implements OnInit {
  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService
  ) {
    super();
  }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT1I060 : ตารางข้อมูลหน่วยสินค้า (UNIT)',
        routerLink: 'home/mmt1i060'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt1i060'
      }
    ]);

    let payload;
    const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    const programId = 'MMT1I060';
    payload = this.append(payload, {
      userId,
      programId
    });
    console.log('payload===>', payload);
    this.userService.addLog(payload).subscribe();
  }
}
