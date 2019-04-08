// import { NgModule, Component } from '@angular/core';

// import {
//   MatButtonModule,
//   MatMenuModule,
//   MatToolbarModule,
//   MatIconModule,
//   MatCardModule
// } from '@angular/material';   

// @NgModule({
//   imports: [
//     MatButtonModule,
//     MatMenuModule,
//     MatToolbarModule,
//     MatIconModule,
//     MatCardModule,
    
//   ],
//   exports: [
//     MatButtonModule,
//     MatMenuModule,
//     MatToolbarModule,
//     MatIconModule,
//     MatCardModule
//   ]
// })


// @Component({
//     selector: 'myApp',
//     template: '  <md-input-container>  <input mdInput [value]="start_date"  [mdDatepicker]="startDate" readonly> <button mdSuffix [mdDatepickerToggle]="startDate"></button>  </md-input-container>  <md-datepicker #startDate ></md-datepicker>'
//     })

// export class MaterialModule {}

// material.module.ts


import { NgModule } from '@angular/core';
import { MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [ MatDatepickerModule ],
})

export class MaterialModule {}