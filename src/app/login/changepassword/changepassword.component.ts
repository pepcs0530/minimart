import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

@Component({
    templateUrl: 'changepassword.component.html',
    styleUrls: ['changepassword.component.css']
})
export class ChangePassword implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    message = undefined;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
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
        this.userService.register(this.registerForm.value)
            .subscribe(
                data => {
                    this.message = { type: 'success', text: 'Registration successful' };
                    this.loading = false;
                    /* this.router.navigate(['/auth']); */
                },
                error => {
                    this.message = { type: 'error', text: 'Registration fail. Please try again.' };
                    this.loading = false;
                });
    }
}
