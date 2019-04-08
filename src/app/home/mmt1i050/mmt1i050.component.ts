import { Component, OnInit } from '@angular/core';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { UserService } from 'src/app/_services/user.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i050',
  templateUrl: './mmt1i050.component.html'
})

export class Mmt1i050Component extends FactoryService implements OnInit {
  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService
  ) {
    super();
  }

  ngOnInit() {
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT1I050 : ตารางข้อมูลราคาสินค้า (PRICE CONFIRM)',
        routerLink: 'home/mmt1i050'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt1i050'
      }
    ]);

    let payload;
    const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    const programId = 'MMT1I050';
    payload = this.append(payload, {
      userId,
      programId
    });
    console.log('payload===>', payload);
    this.userService.addLog(payload).subscribe();
  }
}
