import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FwBreadcrumbService } from '../../services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'fw-breadcrumb',
  templateUrl: './fw-breadcrumb.component.html',
  styleUrls: ['./fw-breadcrumb.component.css']
})
export class FwBreadcrumbComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  items: MenuItem[];

  constructor(public fwBreadcrumbService: FwBreadcrumbService, public authen: AuthenticationService) {
      this.subscription = fwBreadcrumbService.itemsHandler.subscribe(response => {
          this.items = response;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
}
