import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FwBreadcrumbService } from 'src/app/shared/services/fw-breadcrumb/fw-breadcrumb-service';
import { Router } from '@angular/router';
import { Mmt2i010Service } from '../services/mmt2i010.service';
import { HelpersService } from '@libs/helpers/helpers';
import { Table } from 'primeng/table';
import { InvDorderImp } from 'src/app/shared/models/inv-dorder-imp';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InvOrderMas } from 'src/app/shared/models/inv-order-mas';
import { formatDDMMYYYYThaiDate } from 'src/app/shared/utils/format-ddmmyyyy-thai-date';
import { FwMessageComponent } from 'src/app/shared/components/fw-message/fw-message.component';
import { InvOrderGroup } from 'src/app/shared/models/inv-order-group';
import { saveAs as importedSaveAs } from 'file-saver';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FwUploadDownloadFileService } from 'src/app/shared/services/fw-upload-download-file/fw-upload-download-file.service';
import { Inv1r010ReportComponent } from '../inv1r010-report/inv1r010-report.component';
import { Location } from '@angular/common';
import { FwReportService } from 'src/app/shared/services/fw-report/fw-report.service';
import { ReportType } from '@libs/enum/report-type.enum';
import { InvOrderFilecf } from 'src/app/shared/models/inv-order-filecf';
import { SearchComponent } from '../search/search.component';
import { Steps } from 'primeng/steps';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  styles: [`
        .ui-steps .ui-steps-item {
            width: 25%;
        }

        .ui-steps.steps-custom {
            margin-bottom: 30px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link {
            height: 10px;
            padding: 0 1em;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-number {
            background-color: #0081c2;
            color: #FFFFFF;
            display: inline-block;
            width: 36px;
            border-radius: 50%;
            margin-top: -14px;
            margin-bottom: 10px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-title {
            color: #555555;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  detailForm: FormGroup;
  loading: Boolean = false;
  @ViewChild('tb') table: Table;
  @ViewChild('fwMessage') fwMessage: FwMessageComponent;
  @ViewChild('steps') steps: Steps;
  invOrderGroupList: InvOrderGroup[];
  invOrderGroupSelectList: InvOrderGroup[];
  offset = 0;
  limit = 100;
  submitted: Boolean = false;
  onClickSearch: Boolean = false;
  totalRecords: number;
  pagingIndex: number;
  cols: any[];
  status: string;
  stepItems: MenuItem[];
  activeIndex: number;
  currentActiveIndex: number;
  userType: string;
  htmlString: string;

  visibleCancelDialog: Boolean = false;
  cancelForm: FormGroup;

  invOrderMasListById: InvOrderMas[];

  visibleAttachedFileDialog: Boolean = false;

  @ViewChild('inv1r010Report') inv1r010Report: Inv1r010ReportComponent;

  @ViewChild('invOrderFilecftable') invOrderFilecftable: Table;
  invOrderFilecfCols: any[];
  invOrderFilecfList: InvOrderFilecf[];
  invOrderFilecfSelectList: InvOrderFilecf[];

  invOrderFilecfDraftList: InvOrderFilecf[];
  invOrderFilecfDraftSelectList: InvOrderFilecf[];

  invOrderFilecfRealList: InvOrderFilecf[];
  invOrderFilecfRealSelectList: InvOrderFilecf[];

  jobStep: number;
  editAwbFlag: Boolean = false;

  visibleUploadDialog: Boolean = false;
  currentFilecfSerial: number;

  constructor(
    private formBuilder: FormBuilder,
    private fwBreadcrumbService: FwBreadcrumbService,
    public router: Router,
    private mmt2i010Service: Mmt2i010Service,
    private fwUploadDownloadFileService: FwUploadDownloadFileService,
    private fwReportService: FwReportService,
    private location: Location,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    console.log('[login by] => ', this.currentUser);
    this.userType = this.currentUser.userInfo.userType;
    this.fwBreadcrumbService.setItems([
      {
        label: 'MMT2I010 : ข้อมูลการสั่งสินค้า (ORDER)',
        routerLink: 'home/mmt2i010'
      },
      {
        label: 'ค้นหา',
        routerLink: 'home/mmt2i010'
      },
      /* {
        label: 'แก้ไข',
        routerLink: 'home/mmt2i010/add'
      }, */
      {
        label: 'รายละเอียด',
        routerLink: 'home/mmt2i010/detail'
      }
    ]);

    this.detailForm = this.formBuilder.group({
      ordermSerial: [null],
      jobName: [null],
      supplier: [null],
      consignee: [null],
      invoiceNo: [null],
      dvDate: [null],
      areaCode: [null],
      controlCode: [null],
      masterAwb: [null],
      houseAwb: [null],
    });

    this.cancelForm = this.formBuilder.group({
      jobId: [null],
      cancelRemark: [null],
    });

    this.cols = [
      /* { field: 'no', header: 'No.' }, */
      { field: 'partNo', header: 'Part No', style: {'text-align' : 'center'} },
      { field: 'deliveryDate', header: 'Delivery Date', style: {'text-align' : 'center'} },
      { field: 'prodPartNo', header: 'ProdDesc1', style: {'text-align' : 'center'} },
      { field: 'prodDescEng', header: 'ProdDesc2', style: {'text-align' : 'center'} },
      { field: 'prodDescTh', header: 'ProdDesc3', style: {'text-align' : 'center'} },
      { field: 'prodQty', header: 'Quantity', style: {'text-align' : 'center'} },
      { field: 'prodUnit', header: 'ProdUnit', style: {'text-align' : 'center'} },
      { field: 'prodPriceUnit', header: 'UnitPrice', style: {'text-align' : 'center'} },
      { field: 'prodPriceAmt', header: 'ProdAmt', style: {'text-align' : 'center'} },
      { field: 'prodWgh', header: 'WghPerQty', style: {'text-align' : 'center'} },
      { field: 'prodWghUnit', header: 'ProdWUnit', style: {'text-align' : 'center'} },
      { field: 'prodWghAmt', header: 'ProdNWgh', style: {'text-align' : 'center'} },
      { field: 'pplTariffNo', header: 'PPLTariffNo', style: {'text-align' : 'center'} },
      { field: 'pplStaticCode', header: 'PPLStaticCode', style: {'text-align' : 'center'} },
      { field: 'partuseType', header: 'BoiBisUseFlag', style: {'text-align' : 'center'} },
      { field: 'bis19ForBis19TranNo', header: 'Bis19For/Bis19TranNo', style: {'text-align' : 'center'} },
      { field: 'boiForBoiLicenseNo', header: 'BoiFor/BoiLicenseNo', style: {'text-align' : 'center'} },
      { field: 'pricecfNo', header: 'PriceCtlNo', style: {'text-align' : 'center'} },
      { field: 'updateDate', header: 'LastEdit', style: {'text-align' : 'center'} },
    ];

    this.initInvOrderFilecfTable();
    this.setDataToForm();
    this.initStep();
  }

  initStep() {
    /* this.stepItems = [
      {
        label: 'ตรวจสอบข้อมูล',
        command: (event: any) => {
          this.activeIndex = 0;
          console.log('stepItems[0]', event);
        }
      },
      {
        label: 'จัดทำข้อมูล ฉบับ Draft',
        command: (event: any) => {
          this.activeIndex = 1;
          console.log('stepItems[1]', event);
        }
      },
      {
        label: 'จัดทำข้อมูล ฉบับจริง',
        command: (event: any) => {
          this.activeIndex = 2;
          console.log('stepItems[2]', event);
        }
      },
      {
        label: 'สรุป',
        command: (event: any) => {
          this.activeIndex = 3;
          console.log('stepItems[3]', event);
        }
      }
    ]; */
    const payload = {};
    this.mmt2i010Service.getMJobStep(payload)
    .pipe(
      tap(res => {
        console.log('[res]getMJobStep : ', res);

        const result = res.results.map(item => ({
          label: item.jobStepName,
          command: (event: any) => {
            this.checkJobStep(event);
            // this.activeIndex = item.jobStep - 1;
            console.log('stepItems[' + item.jobStep + ']', event);
          }
        }));
        console.log('[result] : ', result);
        this.stepItems = result;
      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('[catchError] : ', err);
          })
      )
    ).subscribe();

    this.stepItems = [
      {
        label: null,
        command: null
      },
    ];

    console.log('stepItems => ', this.stepItems);
  }

  checkJobStep(event) {
    console.log('checkJobStep => ', event.index);
    if (event.index <= this.jobStep - 1) {
      this.activeIndex = event.index;
      this.currentActiveIndex = this.activeIndex;
      console.log('checkJobStep => ', this.activeIndex);
    } else {
      this.activeIndex = this.currentActiveIndex;
    }
  }

  toAddPage() {
    this.router.navigate(['/home/mmt2i010/detail']);
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (this.onClickSearch) {
      const offset = event.first;
      const limit = event.rows;
      this.getInvOrderGroup(offset, limit, false);
    }
  }

  getInvOrderGroup(offset: number, limit: number, onClickSearch: boolean) {
    console.log('[payload] : ', this.detailForm.value);
    this.loading = true;
    this.onClickSearch = true;
    let payload: InvOrderGroup = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderGroup);
    // const supCode = this.helpers.getValueFromAbstractControl(this.detailForm.get('tbSupplier').value, 'supCode');
    // const startSendDate = dateToStrYYYYMMDD(this.searchForm.get('startSendDate').value);
    // const endSendDate = dateToStrYYYYMMDD(this.searchForm.get('endSendDate').value);
    // const impFilename = this.searchForm.get('impFilename').value;
    // const jobId = this.helpers.getValueFromAbstractControl(this.searchForm.get('mJob').value, 'value');
    // const ordermSerial
    const createBy = JSON.parse(localStorage.getItem('currentUser')).userInfo.userId;
    payload = this.helpers.append(payload,
      {
        offset, limit, createBy
      });
    console.log('[payload]-> : ', payload);
    this.mmt2i010Service
      .getInvOrderGroup(payload)
      .pipe(
        tap(res => {
          this.loading = false;
          this.invOrderGroupList = res;
          if (onClickSearch) {
            this.totalRecords = this.invOrderGroupList.length;
          }
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err.data);
              this.loading = false;
              this.fwMessage.messageError('ไม่สามารถค้นหาได้');
            })
        )
      ).subscribe();
  }

  selectRowData(rowData) {

  }

  setDataToForm() {
    if (this.mmt2i010Service.invOrderMasBean) {
      console.log('[detail] : ', this.mmt2i010Service.invOrderMasBean);
      this.mmt2i010Service.getInvOrderMasById(this.mmt2i010Service.invOrderMasBean.ordermSerial)
      .pipe(
        tap(res => {
          this.invOrderMasListById = res[0];
          console.log('[InvOrderMasById] : ', this.invOrderMasListById);
          this.detailForm.patchValue({
            ordermSerial : res[0].ordermSerial,
            supplier : res[0].supCode + ' : ' + res[0].supNameTh,
            consignee : res[0].byrCode + ' : ' + res[0].byrNameTh,
            invoiceNo : res[0].invoiceNo,
            dvDate : formatDDMMYYYYThaiDate(res[0].dvdateStart) + ' - ' + formatDDMMYYYYThaiDate(res[0].dvdateEnd),
            areaCode : res[0].areaCode1 + ' : ' + res[0].areaCode2,
            controlCode : res[0].controlCode,
            masterAwb : res[0].masterAwb,
            houseAwb : res[0].houseAwb,
            jobName : res[0].jobName,
          });

          this.status = res[0].jobId;
          this.jobStep = res[0].jobStep;
          this.currentActiveIndex = this.jobStep - 1;
          this.activeIndex = this.currentActiveIndex;
          // this.steps.activeIndexChange.emit(this.currentActiveIndex);
          /* if (res[0].jobId === 2) {
            this.activeIndex = 0;
          } */

          this.getInvOrderGroup(this.offset, this.limit, true);
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err);
            })
        )
      ).subscribe();

      /* this.mmt2i010Service.getInvOrderGroupByOrdermSerial(this.mmt2i010Service.invOrderMasBean.ordermSerial)
      .pipe(
        tap(res => {
          this.invOrderGroupList = res;
          console.log('[InvOrderGroupByOrdermSerial] : ', this.invOrderGroupList);
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err);
            })
        )
      ).subscribe(); */
      this.setInvOrderFilecfTable();
    }

    this.initReportForm();
  }

  initReportForm() {
    this.inv1r010Report.idNo = 'NIT1';
  }

  initInvOrderFilecfTable() {
    this.invOrderFilecfCols = [
      { field: 'fileName', header: 'เอกสาร', style: {'text-align' : 'left'} },
      { field: 'exportButton', header: '', style: {'text-align' : 'left'}, width: '60em' },
      { field: 'filecfName1', header: 'ชื่อไฟล์เอกสาร', style: {'text-align' : 'left'} },
      { field: 'filecfDate', header: 'วันที่ยืนยันข้อมูล', style: {'text-align' : 'center'} },
    ];
  }

  setInvOrderFilecfTable() {
    this.loading = true;
    this.mmt2i010Service.getInvOrderFilecf(this.mmt2i010Service.invOrderMasBean)
    .pipe(
      tap(res => {
        console.log('[invOrderFilecfTable] : ', res);
        this.loading = false;

        // สิทธิ์ user จะเห็นทุก fileType
        this.invOrderFilecfList = res.results;

        // สิทธิ์ admin ฉบับ draft จะเห็นเฉพาะ fileType = 1
        this.invOrderFilecfDraftList = res.results.filter(item => item.fileType === '1');

        // สิทธิ์ admin ฉบับจริง จะเห็นทั้ง fileType = 1,2
        this.invOrderFilecfRealList = res.results.filter(item => item.fileType <= '2');
      }
      ), catchError(
        err =>
          new Observable(() => {
            console.log('[catchError] : ', err);
            this.loading = false;
          })
      )
    ).subscribe();
  }

  confirmCheckDraft() {
    const payload = {
      ordermSerial: this.mmt2i010Service.invOrderMasBean.ordermSerial,
      jobId: this.mmt2i010Service.invOrderMasBean.jobId,
      invoiceNo: this.detailForm.get('invoiceNo').value,
      controlCode: this.detailForm.get('controlCode').value,
      masterAwb: this.detailForm.get('masterAwb').value,
      houseAwb: this.detailForm.get('houseAwb').value,
      jobStep: '2',
      updateBy: JSON.parse(localStorage.getItem('currentUser')).userInfo.userId
    };
    this.mmt2i010Service.updateInvOrderMas(payload)
    .pipe(
      tap(res => {
        this.fwMessage.messageSuccess('ยืนยันข้อมูลสำเร็จ');
        this.setDataToForm();
      }), catchError(err => new Observable(() => {})))
    .subscribe();
  }

  cancelCheckDraft() {
    this.cancel(93);
  }

  // user กดปุ่ม CONFIRM ส่งข้อมูล
  confirm() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const impFilename = this.invOrderMasListById['impFilename'];
    const jobId = 2;
    const jobStep = 1;
    const fileType = '1';
    const createBy = currentUser.userInfo.userId;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, jobStep, updateBy });

    this.mmt2i010Service.confirmData(payload)
    .pipe(tap(res => {
      console.log('[confirm] : ', res);
      this.status = res['body']['jobId'];
      console.log('[status] : ', this.status);

      this.mmt2i010Service.insertInvOrderFilecf(
        {
          createBy, ordermSerial, impFilename, fileType
        }
      )
      .pipe(tap(insert => {
        console.log('[insert] : ', insert);
        this.setDataToForm();
        this.fwMessage.messageSuccess('ส่งข้อมูลสำเร็จ');
      }), catchError(err => new Observable(() => {}))).subscribe();

    }), catchError(err => new Observable(() => {
      console.log('[catchError] : ', err.data);
      this.fwMessage.messageError('ไม่สามารถส่งข้อมูลสำเร็จได้');
    }))).subscribe();
  }

  confirmDraft() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const impFilename = this.invOrderMasListById['impFilename'];
    const jobId = 4;
    const jobStep = 3;
    const fileType = '2';
    const createBy = currentUser.userInfo.userId;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, jobStep, updateBy });
    console.log('payload[confirmDraft] : ', payload);
    this.mmt2i010Service.confirmData(payload)
    .pipe(tap(res => {
      console.log('response[confirmData] : ', res);
      this.status = res['body']['jobId'];
      console.log('[status] : ', this.status);

      this.mmt2i010Service.updateFilecfDate(payload)
      .pipe(tap(update => {
        console.log('response[updateFilecfDate] : ', update);
        this.mmt2i010Service.insertInvOrderFilecf(
          {
            createBy, ordermSerial, impFilename, fileType
          }
        )
        .pipe(tap(insert => {
          console.log('response[insert] : ', insert);
          this.setDataToForm();
          this.fwMessage.messageSuccess('ส่งข้อมูลสำเร็จ');
        }), catchError(err => new Observable(() => {}))).subscribe();

      }), catchError(err => new Observable(() => {}))).subscribe();

    }), catchError(err => new Observable(() => {
      console.log('[catchError] : ', err.data);
      this.fwMessage.messageError('ไม่สามารถส่งข้อมูลได้');
    }))).subscribe();
  }

  sendDataReal() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const impFilename = this.invOrderMasListById['impFilename'];
    const jobId = 5;
    const jobStep = 4;
    const fileType = '2';
    const createBy = currentUser.userInfo.userId;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, jobStep, updateBy });
    console.log('payload[sendDataReal] : ', payload);
    this.mmt2i010Service.confirmData(payload)
    .pipe(tap(res => {
      console.log('response[sendDataReal] : ', res);
      this.setDataToForm();
      this.fwMessage.messageSuccess('ส่งข้อมูลสำเร็จ');
    }), catchError(err => new Observable(() => {
      this.fwMessage.messageError('ไม่สามารถส่งข้อมูลได้');
    }))).subscribe();
  }

  // admin / user กดปุ่ม CANCEL ข้อมูล
  // user ส่งข้อมูล รอตรวจสอบ (02) -> 92
  // admin ตรวจสอบยืนยันข้อมูล - สร้างข้อมูลฉบับ draft (03) -> 93
  // user ยืนยันข้อมูลฉบับ draft - รอสร้างข้อมูลฉบับจริง (04) -> 94
  // admin สร้างข้อมูลฉบับจริงและใบขน -> 95
  cancel(jobId) {
    console.log('[cancel job id] : ', jobId);
    this.cancelForm.get('jobId').setValue(jobId);
    this.visibleCancelDialog = true;
  }

  confirmDialog() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const jobId = this.cancelForm.get('jobId').value;
    const cancelRemark = this.cancelForm.get('cancelRemark').value;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, cancelRemark, updateBy });

    this.mmt2i010Service.cancelData(payload)
    .pipe(tap(res => {
      console.log('[cancel] : ', res);
      this.status = res['body']['jobId'];
      console.log('[status] : ', this.status);
      this.fwMessage.messageSuccess('ยกเลิกข้อมูลสำเร็จ');
    }), catchError(err => new Observable(() => {
      console.log('[catchError] : ', err.data);
      this.fwMessage.messageError('ไม่สามารถยกเลิกข้อมูลได้');
    }))).subscribe();
    this.visibleCancelDialog = false;
  }

  cancelDialog() {
    this.cancelForm.reset();
  }

  draftInvoice() {
    const condition = {
      ordermSerial: 1
    };
    // console.log('[condition] : ', condition);
    // console.log('[condition format] : ', this.helpers.formatParamsToString(condition, true));
    // console.log('[condition format] : ', this.helpers.formatParamsToString(condition, false));
    this.fwReportService.getReport('inv1r010', condition, ReportType.PDF);
  }

  draftInvoicePo() { }

  exportInvoiceData() {
    this.exportData();
  }

  sendDataDraft() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const jobId = 3;
    const jobStep = 2;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, jobStep, updateBy });

    this.mmt2i010Service.confirmData(payload)
    .pipe(tap(res => {
      console.log('[confirm] : ', res);
      this.status = res['body']['jobId'];
      console.log('[status] : ', this.status);
      this.setDataToForm();
      this.fwMessage.messageSuccess('ส่งข้อมูลสำเร็จ');
    }), catchError(err => new Observable(() => {
      console.log('[catchError] : ', err.data);
      this.fwMessage.messageError('ไม่สามารถส่งข้อมูลสำเร็จได้');
    }))).subscribe();
  }

  confirmDataDraft() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let payload: InvOrderMas = this.helpers.copy(this.detailForm.getRawValue(), new InvOrderMas);
    const ordermSerial = this.invOrderMasListById['ordermSerial'];
    const impFilename = this.invOrderMasListById['impFilename'];
    const jobId = 4;
    const jobStep = 4;
    const fileType = '2';
    const createBy = currentUser.userInfo.userId;
    const updateBy = currentUser.userInfo.userId;
    payload = this.helpers.append({}, { ordermSerial, jobId, jobStep, updateBy });
    console.log('payload[sendDataReal] : ', payload);
    this.mmt2i010Service.confirmData(payload)
    .pipe(tap(res => {
      console.log('response[sendDataReal] : ', res);
      this.setDataToForm();
      this.fwMessage.messageSuccess('ส่งข้อมูลสำเร็จ');
    }), catchError(err => new Observable(() => {
      this.fwMessage.messageError('ไม่สามารถส่งข้อมูลได้');
    }))).subscribe();
  }

  cancelDraft() { }

  exportData() {
    // console.log('[ordermSerial] : ', this.mmt2i010Service.invOrderMasBean.ordermSerial);
    // this.mmt2i010Service.exportInvoiceData(this.mmt2i010Service.invOrderMasBean.ordermSerial)
    this.mmt2i010Service.exportInvoiceDataInvOrderGroup(this.mmt2i010Service.invOrderMasBean)
      .pipe(
        tap(res => {
          // this.invOrderGroupList = res;
          console.log('[Data(s) to write excel file] : ', res);
          if (res['fileName']) {
            this.exportFile(res['fileName']);
          }
        }
        ), catchError(
          err =>
            new Observable(() => {
              console.log('[catchError] : ', err);
            })
        )
      ).subscribe();
  }

  exportFile(filename) {
    console.log('[exportFile] : ', filename);
    this.fwUploadDownloadFileService.downloadFile(filename)
      .subscribe(resultBlob => {
        // Success
        console.log('start download:', resultBlob);
        const blob = new Blob([resultBlob], { type: 'application/pdf' });
        importedSaveAs(blob, filename);
      },
        error => {
          // Error
          console.log(error);
          this.fwMessage.messageError('ไม่สามารถ Export ได้');
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

  uploadFilecf(rowData) {
    this.visibleUploadDialog = true;
    this.currentFilecfSerial = rowData['filecfSerial'];
  }

  onBeforeSend(event) {
    const token = JSON.parse(localStorage.getItem('currentUser')).token;
    const uploadDate = new Date();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const createBy = currentUser.userInfo.userId;
    event.formData.append('startDate', new Date().getTime());
    event.formData.append('endDate', new Date().getTime());
    event.formData.append('createBy', createBy);
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }

  onSelect(event) {}

  onBeforeUpload(event) {}

  onUpload(event) {
    console.log('[onUpload] :', event);
    if (event.xhr.status === 200) {
      const payload = {
        'filecfSerial': this.currentFilecfSerial,
        'filecfName1': event.files[0]['name']
      };
      console.log('onUpload[payload] :', payload);
      this.updateInvOrderFilecf(payload);
      this.visibleUploadDialog = false;
      this.fwMessage.messageSuccess('อัพโหลดสำเร็จ');
    } else {
      this.fwMessage.messageError('อัพโหลดไม่สำเร็จ');
    }
  }

  exportFilecf(rowData) {
    // fileId (1=iXimple Type D, 2=ขอออกใบขนสินค้า, 3=DRAFT INVOICE, 4=DRAFT ใบขนสินค้าขาออก)
    console.log('[export] : ', rowData);
    if (rowData['fileId'] === 1) {
      console.log('Export iXimple Type D');

      // อัพเดตชื่อไฟล์ (FILECF_NAME1)
      const payload = {
        'filecfSerial': rowData['filecfSerial'],
        'ordermSerial': rowData['ordermSerial'],
        'filecfName1': 'CDS_DF101_1_' + this.invOrderMasListById['invoiceNo'] + '.xlsx'
      };

      if (rowData['filecfName1']) {
        this.exportFile(rowData['filecfName1']);
      } else {
        // export ครั้งแรก
        this.getIXimpleTypeDFile(payload);
      }

    } else if (rowData['fileId'] === 2) {
      console.log('Export ขอออกใบขนสินค้า');
      this.exportFile(rowData['filecfName1']);
    } else if (rowData['fileId'] === 3) {
      console.log('Export DRAFT INVOICE');

      // ออกรายงานจาก jasper report server
      /*
      // แบบเก่า เรียกผ่าน jasper server
      const condition = {
        ordermSerial: this.mmt2i010Service.invOrderMasBean.ordermSerial
      };
      this.fwReportService.getReport('inv1r010', condition, ReportType.PDF); */

      // แบบใหม่ เรียกผ่าน API
      const condition = {
        templateFileName: 'inv1r010.jrxml',
        outputFileName: 'DRAFT_INV_' + this.invOrderMasListById['invoiceNo'],
        fileType : 'pdf',
        params : {
          ordermSerial : this.mmt2i010Service.invOrderMasBean.ordermSerial
        }
      };
      this.fwReportService.generateReport(condition)
      .pipe(tap(res => {
        console.log('generateReport[Success] : ', res);
        this.exportFile(payload['filecfName1']);
      }), catchError(err => new Observable(() => {
        console.log('generateReport[Error] : ', err);
      }))).subscribe();

      // อัพเดตชื่อไฟล์ (FILECF_NAME1)
      const payload = {
        'filecfSerial': rowData['filecfSerial'],
        'filecfName1': 'DRAFT_INV_' + this.invOrderMasListById['invoiceNo'] + '.pdf'
      };
      this.updateInvOrderFilecf(payload);
    } else if (rowData['fileId'] === 4) {
      console.log('Export DRAFT ใบขนสินค้าขาออก');
      this.exportFile(rowData['filecfName1']);

      /* const exportFilename = 'xxx.pdf';
      this.fwReportService.getJasperReportFile(exportFilename)
      .subscribe(resultBlob => {
        // Success
        console.log('start download:', resultBlob);
        const blob = new Blob([resultBlob], { type: 'application/pdf' });
        importedSaveAs(blob, exportFilename);
      },
        error => {
          // Error
          console.log(error);
          this.fwMessage.messageError('ไม่สามารถดาวน์โหลดได้ เนื่องจากไม่พบไฟล์ดังกล่าว');
        }); */

      /* this.fwReportService.getReport2(exportFilename).subscribe(resultBlob => {
        // Success
        console.log('start download:', resultBlob);
        const blob = new Blob([resultBlob], { type: 'application/pdf' });
        importedSaveAs(blob, exportFilename);
      },
        error => {
          // Error
          console.log(error);
          this.fwMessage.messageError('ไม่สามารถ Export ได้');
        }); */

        // this.fwReportService.getReport2(exportFilename);

        /* this.fwReportService.getReport2(exportFilename).subscribe(
          res => {
            console.log('res => ', res);
            this.htmlString = res;


            const data = document.getElementById('contentToConvert');
            html2canvas(data).then(canvas => {

              // Few necessary setting options
              const imgWidth = 208;
              const pageHeight = 295;
              const imgHeight = canvas.height * imgWidth / canvas.width;
              const heightLeft = imgHeight;
              const contentDataURL = btoa(canvas.toDataURL('image/png'));
              const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
              const position = 0;
              pdf.addImage(contentDataURL, 'PNG', 0 + 5, position + 5, imgWidth - 10, imgHeight);
              pdf.save('MYPdf.pdf'); // Generated PDF
            });
          }
        ); */
    }
  }

  updateInvOrderFilecf(payload: InvOrderFilecf) {
    console.log('updateInvOrderFilecf[payload] : ', payload);
    this.mmt2i010Service.updateInvOrderFilecf(payload)
    .pipe(tap(res => {
      console.log('updateInvOrderFilecf[Success] : ', res);
      this.setInvOrderFilecfTable();
    }), catchError(err => new Observable(() => {
      console.log('updateInvOrderFilecf[Error] : ', err);
    }))).subscribe();
  }

  getIXimpleTypeDFile(payload: InvOrderFilecf) {
    this.mmt2i010Service.getIXimpleTypeDFile(payload)
    .pipe(tap(res => {
      console.log('getIXimpleTypeDFile[Success] : ', res);
      this.updateInvOrderFilecf(payload);
      this.exportFile(payload['filecfName1']);
    }), catchError(err => new Observable(() => {
      console.log('getIXimpleTypeDFile[Error] : ', err);
    }))).subscribe();
  }

  editAwb() {
    this.editAwbFlag = true;
  }

  confirmEditAwb() {
    const payload = {
      ordermSerial: this.mmt2i010Service.invOrderMasBean.ordermSerial,
      jobId: this.mmt2i010Service.invOrderMasBean.jobId,
      invoiceNo: this.detailForm.get('invoiceNo').value,
      controlCode: this.detailForm.get('controlCode').value,
      masterAwb: this.detailForm.get('masterAwb').value,
      houseAwb: this.detailForm.get('houseAwb').value,
      jobStep: this.jobStep,
      updateBy: JSON.parse(localStorage.getItem('currentUser')).userInfo.userId
    };
    this.mmt2i010Service.updateInvOrderMas(payload)
    .pipe(
      tap(res => {
        this.fwMessage.messageSuccess('แก้ไขข้อมูลสำเร็จ');
        this.editAwbFlag = false;
        this.setDataToForm();
      }), catchError(err => new Observable(() => {})))
    .subscribe();
  }

  cancelEditAwb() {
    this.setDataToForm();
    this.editAwbFlag = false;
  }

  attachedFiles() {
    this.visibleAttachedFileDialog = true;
  }

  getReportFile(fileName) {
    this.fwReportService.getReport(fileName, null, ReportType.PDF);
  }
}
