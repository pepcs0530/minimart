import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { MessageService } from 'primeng/api';

import { FactoryService } from '@libs/services/factory/factoryservice.service';

import { Message } from 'primeng/components/common/api';

declare var grecaptcha: any;

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
    providers: [MessageService]
})
export class LoginComponent extends FactoryService implements OnInit {
    loading = false;
    submitted = false;
    returnUrl: string;
    //error = '';
    username: string;
    password: string;

    captchaError: boolean = false;

    msgs: Message[] = [];

    visibleError: Boolean = false;

    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,private service: MessageService) {
        super();
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.changeTheme('lightblue');
        this.changeLayout('cloudy');
    }


    onSubmit() {
       // alert('--onSubmit---');
        this.submitted = true;

        //const response = grecaptcha.getResponse();
        const response = '';

        // stop here if form is invalid
        if (this.username === undefined || this.password === undefined) {
            return;
        }

        this.loading = true;

        //alert(response.length);

        if (response.length === 0) {
            this.captchaError = true;
         //  return;
          }


        this.authenticationService.login(this.username, this.password,response)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
               // grecaptcha.reset();
            },
            error => {             
              this.messageError('รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                this.loading = false;
            });
    }


    clearMessage(){
        this.close();
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
