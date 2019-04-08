import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';


import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScheduleModule } from 'primeng/schedule';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { HomeRoutingModule } from './home.routing.module';
import { AppModule } from '../app.module';
import { ReportComponent } from './report/report.component';
import { LabelComponent } from '@libs/components/label/label.component';
import { SaveComponent } from './save/save.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FactoryService } from '@libs/services/factory/factoryservice.service';
import { MaterialModule } from '../shared/component/material.module';
import { DataTableModule } from 'primeng/datatable';

import { EditComponent } from './save/edit.component';

import { Mmt1i010Component } from './mmt1i010/mmt1i010.component';
import { Mmt1i010SearchComponent } from './mmt1i010/search/search.component';
import { Mmt1i010SaveComponent } from './mmt1i010/save/save.component';

import { Mmt1i020Component } from './mmt1i020/mmt1i020.component';
import { Mmt1i020SearchComponent } from './mmt1i020/search/search.component';
import { Mmt1i020SaveComponent } from './mmt1i020/save/save.component';
import { Mmt1i020SupplierComponent } from './mmt1i020/supplier/supplier.component';

import { Mmt1i030Component } from './mmt1i030/mmt1i030.component';
import { Mmt1i030SearchComponent } from './mmt1i030/search/search.component';
import { Mmt1i030SaveComponent } from './mmt1i030/save/save.component';

import { Mmt1i060Component } from './mmt1i060/mmt1i060.component';
import { Mmt1i060SearchComponent } from './mmt1i060/search/search.component';
import { Mmt1i060SaveComponent } from './mmt1i060/save/save.component';

import { Mmt1i040Component } from './mmt1i040/mmt1i040.component';
import { Mmt1i040SearchComponent } from './mmt1i040/search/search.component';
import { Mmt1i040SaveComponent } from './mmt1i040/save/save.component';
import { Mmt1i040UploadComponent } from './mmt1i040/upload/upload.component';

import { Mmt1i050Component } from './mmt1i050/mmt1i050.component';
import { Mmt1i050SearchComponent } from './mmt1i050/search/search.component';
import { Mmt1i050SaveComponent } from './mmt1i050/save/save.component';
import { Mmt1i050UploadComponent } from './mmt1i050/upload/upload.component';



import { NumberOnlyDirective } from '../shared/fzStd/NumberOnlyDirective';

import { Tab0i010Component } from './tab/tab0i010/tab0i010.component';
import { Tab0i010SearchComponent } from './tab/tab0i010/search/search.component';
import { Tab0i010SaveComponent } from './tab/tab0i010/save/save.component';

import { Tab0i020Component } from './tab/tab0i020/tab0i020.component';
import { Tab0i020SearchComponent } from './tab/tab0i020/search/search.component';
import { Tab0i020SaveComponent } from './tab/tab0i020/save/save.component';

import { Tab0i030Component } from './tab/tab0i030/tab0i030.component';
import { Tab0i030SearchComponent } from './tab/tab0i030/search/search.component';
import { Tab0i030SaveComponent } from './tab/tab0i030/save/save.component';
import { DateThaiFormatDDMMYYYYModule } from '../shared/pipes/date-thai-format-ddmmyyyy/date-thai-format-ddmmyyyy.module';
import { ThaiBathFormatPipeModule } from '../shared/pipes/thai-bath-format/thai-bath-format.module';
import { DecimalWithDigitsDirective } from '../shared/fzStd/DecimalWithDigitsDirective';
import { CurrencyDirective } from '../shared/fzStd/CurrencyDirective';
import { FwMessageModule } from '../shared/components/fw-message/fw-message.module';
import { FwDatepickerComponent } from '../shared/components/fw-datepicker/datepicker.component';

@NgModule({
    imports: [
        // MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        HomeRoutingModule,
        ScrollPanelModule,
        SpinnerModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        DataTableModule,
        FwMessageModule,
        DateThaiFormatDDMMYYYYModule,
        ThaiBathFormatPipeModule
    ],
    exports: [
        // MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        HomeRoutingModule,
        ScrollPanelModule,
        SpinnerModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        DataTableModule,
        FwMessageModule,
        DateThaiFormatDDMMYYYYModule,
        ThaiBathFormatPipeModule,
        FwDatepickerComponent
    ],
    declarations: [
        // DashboardComponent,
        ReportComponent,
        LabelComponent,
        SaveComponent,
        DatepickerComponent,
        FwDatepickerComponent,
        FactoryService,
        EditComponent,
        NumberOnlyDirective,
        DecimalWithDigitsDirective,
        CurrencyDirective,
        Mmt1i010Component,
        Mmt1i010SearchComponent,
        Mmt1i010SaveComponent,
        Mmt1i020Component,
        Mmt1i020SearchComponent,
        Mmt1i020SaveComponent,
        Mmt1i020SupplierComponent,
        Mmt1i030Component,
        Mmt1i030SearchComponent,
        Mmt1i030SaveComponent,
        Mmt1i040Component,
        Mmt1i040SearchComponent,
        Mmt1i040SaveComponent,
        Mmt1i040UploadComponent,
        Mmt1i050Component,
        Mmt1i050SearchComponent,
        Mmt1i050SaveComponent,
        Mmt1i050UploadComponent,
        Tab0i010Component,
        Tab0i010SearchComponent,
        Tab0i010SaveComponent,
        Tab0i020Component,
        Tab0i020SearchComponent,
        Tab0i020SaveComponent,
        Tab0i030Component,
        Tab0i030SearchComponent,
        Tab0i030SaveComponent,
        Mmt1i060Component,
        Mmt1i060SearchComponent,
        Mmt1i060SaveComponent
    ]
})
export class HomeModule { }
