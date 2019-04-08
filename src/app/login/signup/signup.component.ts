//import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

import { Component, OnInit, NgModule, Input } from '@angular/core';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    message = undefined;
    value: Date;
    es: any;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            username: ['', Validators.required],
            stationId:  ['', Validators.required],
            approveId:  ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            projObj:['',Validators.required],          
            picker:[''],
          
            
        });


        this.es = {
            //date
            closeText: "Cerrar",
            prevText: "<Ant",
            nextText: "Sig>",
            currentText: "Hoy",
            monthNames: [ "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
            "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน1","ธันวาคม" ],
            monthNamesShort: [ "มก","กพ","มค","เมษ","พฤษ","มิถุ",
            "กรก","สค","กย","ตค","พฤศ","ธค" ],
            dayNames: [ "a","b","c","v","v","v","sábvado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            weekHeader: "Sm",
            dateFormat: "dd/mm/yy",
            //locale : "th",
           // firstDay: 1,
            isRTL: true,
            //showMonthAfterYear: true,
            shortYearCutoff: "+543" ,
    
          
        };
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        // this.userService.register(this.registerForm.value)
        //     .subscribe(
        //         data => {
        //             this.message = {type: 'success', text: 'Registration successful'};
        //             this.loading = false;
        //             /* this.router.navigate(['/auth']); */
        //         },
        //         error => {
        //             this.message = {type: 'error', text: 'Registration fail. Please try again.'};
        //             this.loading = false;
        //         });
    }

    getFwMenu(){
       // alert('getFwMenu');

    }
}
