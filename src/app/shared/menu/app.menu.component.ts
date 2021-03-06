import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem, ScrollPanel } from 'primeng/primeng';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, AfterViewInit {

    @Input() reset: boolean;

    model: any[];

    @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;

    constructor(public app: AppComponent ) {


    }

    ngAfterViewInit() {
        setTimeout(() => { this.layoutMenuScrollerViewChild.moveBar(); }, 100);

    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.model = JSON.parse(user.menu);
        console.log('menu===>', this.model  );
        console.log(user  );

        // this.app.sidebarActive = true;

        // this.app.layoutMode = 'static';

        // this.changeLayout('pink');

        this.changeLayout('cloudy');
        this.changeTheme('lightblue');

        // this.changeLayout('indigo')

        // this.changeLayout('cloudy');

        // this.changeTheme('cyan');
        // this.changeLayout('moody');
        // this.changeTheme('teal');

        console.log('model==>', this.model);

        const x = [
            { label: 'ข้อมูลผู้ซื้อ (Buyer)', icon: 'desktop_mac', routerLink: ['/home/mmt1i010'] },
            { label: 'ข้อมูลผู้ส่งออก (Supplier)', icon: 'desktop_mac', routerLink: ['/home/mmt1i020'] },
            { label: 'ข้อมูลอ้างอิงผู้ซื้อ (Consignee)', icon: 'desktop_mac', routerLink: ['/home/mmt1i030'] },
            { label: 'ข้อมูลรหัสสินค้า (PartNo)', icon: 'desktop_mac', routerLink: ['/home/mmt1i040'] },
            { label: 'ข้อมูลราคาสินค้า (Price Confirm)', icon: 'desktop_mac', routerLink: ['/home/mmt1i050'] },
            { label: 'ข้อมูลหน่วยสินค้า (Unit)', icon: 'desktop_mac', routerLink: ['/home/mmt1i060'] },
            { label: 'ข้อมูลการสั่งสินค้า (Order)', icon: 'desktop_mac', routerLink: ['/home/mmt2i010'] },
            { label: 'ข้อมูลการแจ้ง SHORT', icon: 'desktop_mac', routerLink: ['/home/mmt2i020'] },
        ];

        this.model = x;
    }

    changeTheme(theme) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';
    }

    changeLayout(theme) {
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
    }
}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   (mouseenter)="onMouseEnter(i)" class="ripplelink">
                    <i class="material-icons">{{child.icon}}</i>
                    <span class="menuitem-text">{{child.label}}</span>
                    <i class="material-icons layout-submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>

                <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   (mouseenter)="onMouseEnter(i)" class="ripplelink">
                    <i class="material-icons">{{child.icon}}</i>
                    <span class="menuitem-text">{{child.label}}</span>
                    <i class="material-icons layout-submenu-toggler" *ngIf="child.items">>keyboard_arrow_down</i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items && isActive(i)" [visible]="isActive(i)" [reset]="reset"
                    [parentActive]="isActive(i)" [@children]="(app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px'
            })),
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    _parentActive: boolean;

    activeIndex: number;

    constructor(public app: AppComponent, public router: Router, public location: Location, public appMenu: AppMenuComponent) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
            event.preventDefault();
        }

        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        if (item.routerLink || item.items || item.command || item.url) {
            this.activeIndex = (this.activeIndex as number === index) ? -1 : index;
        }

        // execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            setTimeout(() => {
                this.appMenu.layoutMenuScrollerViewChild.moveBar();
            }, 450);
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isMobile()) {
                this.app.sidebarActive = false;
                this.app.mobileMenuActive = false;
            }

            if (this.app.isHorizontal()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && this.app.isHorizontal()
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() || this.app.isOverlay())) {
            this.activeIndex = null;
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
