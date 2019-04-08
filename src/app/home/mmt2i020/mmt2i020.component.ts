import { Component, OnInit } from '@angular/core';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';

@Component({
  selector: 'app-mmt2i020',
  templateUrl: './mmt2i020.component.html',
  styleUrls: ['./mmt2i020.component.css']
})
export class Mmt2i020Component implements OnInit {

  constructor(
    private fwBreadcrumbService: FwBreadcrumbService
  ) { }

  ngOnInit() {
  }

}
