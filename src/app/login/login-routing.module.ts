import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './signin/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChangePassword } from './changepassword/changepassword.component';
import { ConfirmSignupComponent } from './signup/confirm-signup.component';
import { ForgetPassword } from './forgetpassword/forgetpassword.component';




const routes: Routes = [
  {
    path: 'signin',
    component: LoginComponent
  }, {
    path: 'signup',
    component: SignupComponent
  },{
    path: 'confirm-signup',
    component: ConfirmSignupComponent
  },
  {
    path: 'changepassword',
    component: ChangePassword
  },
  {
    path: 'forgetpassword',
    component: ForgetPassword
  },
  
  { path: '**', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
