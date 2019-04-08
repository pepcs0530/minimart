import { Component, OnInit } from '@angular/core';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt2i010',
  templateUrl: './mmt2i010.component.html',
  styleUrls: ['./mmt2i010.component.css']
})
export class Mmt2i010Component implements OnInit {

  constructor(
    private fwBreadcrumbService: FwBreadcrumbService
  ) { }

  ngOnInit() {
  }

}
