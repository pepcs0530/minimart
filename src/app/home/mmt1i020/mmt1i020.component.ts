import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt1i020',
  templateUrl: './mmt1i020.component.html'
})

export class Mmt1i020Component extends FactoryService implements OnInit {

  deptPk: number;

  constructor(
    private userService: UserService,
    private fwBreadcrumbService: FwBreadcrumbService
  ) {
    super();
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('[currentUser] : ', currentUser);
    this.deptPk = currentUser.userInfo.deptPk;

    if (this.deptPk) {
      this.fwBreadcrumbService.setItems([
        {
          label: 'MMT1I020 : ข้อมูลผู้ส่งออก (SUPPLIER)',
          routerLink: 'home/mmt1i020'
        }
      ]);
    } else {
      this.fwBreadcrumbService.setItems([
        {
          label: 'MMT1I020 : ตารางข้อมูลผู้ส่งออก (SUPPLIER)',
          routerLink: 'home/mmt1i020'
        },
        {
          label: 'ค้นหา',
          routerLink: 'home/mmt1i020'
        }
      ]);
    }

     let payload;
     const userId = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
     const programId = 'MMT1I020';
     payload = this.append(payload, {
       userId,
       programId
     });
     console.log('payload===>', payload);
     this.userService.addLog(payload).subscribe();
   }
}
