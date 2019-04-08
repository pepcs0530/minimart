import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Router } from '@angular/router';
import { Mmt2i010Service } from '../services/mmt2i010.service';
import { FwUploadDownloadFileService } from 'src/app/shared/services/fw-upload-download-file/fw-upload-download-file.service';
import { HelpersService } from '@libs/helpers/helpers';


@Component({
  selector: 'app-inv1r010-report',
  templateUrl: './inv1r010-report.component.html',
  styleUrls: ['./inv1r010-report.component.css']
})
export class Inv1r010ReportComponent implements OnInit {

  reportForm: FormGroup;

  idNo: string;
  supplier: string;
  consignee: string;
  invoiceNo: string;
  date: string;
  controlDate: string;
  deliveryTag: string;
  deliveryDate: string;
  destination: string;
  plantCode: string;

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    public router: Router,
    private mmt2i010Service: Mmt2i010Service,
    private fwUploadDownloadFileService: FwUploadDownloadFileService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.reportForm = this.formBuilder.group({
      idNo: [null],
      supplier: [null],
      consignee: [null],
      invoiceNo: [null],
      date: [null],
      controlDate: [null],
      deliveryTag: [null],
      deliveryDate: [null],
      destination: [null],
      plantCode: [null],
    });
  }

  public generatePDF() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {

      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0 + 5, position + 5, imgWidth - 10, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

}
