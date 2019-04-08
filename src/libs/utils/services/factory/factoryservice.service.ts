
//import { Store } from '@ngrx/store';

// import { RootState } from '@libs/models/root-state';
// import {
//   SuccessMessage,
//   InfoMessage,
//   WarningMessage,
//   ErrorMessage
// } from '@libs/store/actions/message.action';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit, Input, Injectable } from '@angular/core';

import { Message } from 'primeng/components/common/api';

import {  FormGroup } from '@angular/forms';


@Component({
  selector: 'fw-message',
  templateUrl: './factoryservice.html',
//  styleUrls: ['./label.component.scss']
})


@Injectable()
export class FactoryService {

  @Input() msgStr:string;
  @Input() 

  msgs: Message[] = [];

  visibleError: Boolean = false;
  loading : Boolean = false;
  //constructor(private http: HttpClient) {}

  messageSuccess(messages) {
    this.msgs = [];
    // this.msgs.push({severity:'success', summary:'Success Message', detail:messages});
    this.msgs.push({severity:'success', summary:'', detail:messages});
    this.visibleError = true;  
  }

  messageInfo(messages) {
    this.msgs = [];
    // this.msgs.push({severity:'info', summary:'Info Message', detail:messages});
    this.msgs.push({severity:'info', summary:'', detail:messages});
    this.visibleError = true;  
  }

  messageWarning(messages) {   
    this.msgs = [];
    // this.msgs.push({severity:'warn', summary:'Warn Message', detail:messages});
    this.msgs.push({severity:'warn', summary:'', detail:messages});
    this.visibleError = true;  
   
  }

  messageError(messages) {  
    this.msgs = [];  
    // this.msgs.push({severity:'error', summary:'Error Message', detail:messages});
    this.msgs.push({severity:'error', summary:'', detail:messages});
    this.visibleError = true;  
  }

  close(){
    //alert('close==>clear array object');
   this.msgs = [];
   this.loading = false;
  }

  toggleLoadingIndicator(display: boolean) {
    //this.fs.http.setLoadingindicator(display);
  //  this.store.dispatch(new ToggleLoadingIndicator(display));
  }


  copy(source: object, target: Object) {
    return Object.keys(target).reduce(
      (destObj: object, targetField) =>
        source[targetField] !== null && source[targetField] !== undefined
          ? {
              ...destObj,
              [targetField]: source[targetField]
            }
          : destObj,
      {}
    );
  }

  append(origin: object, value: object) {
    return { ...origin, ...value };
  }

  validateNumberField(
       
    event,
    formGroup,
    id,
    precision: number,
    scale: number
  ) {
    //  alert('---validateNumberField--'+input);
    let input:string = formGroup.get(id).value;
    if (input) {
      // console.log('rowData-->', input);
      const length = precision - scale;
      const regexpString = /^\d{0,7}(\.\d{0,2})?$/;
      const regexp = new RegExp(
        '^\\d{0,' + length + '}(\\.\\d{0,' + scale + '})?$'
      );
  
      /* console.log('regexp-->', regexp);
      console.log('valid-->', regexp.test(input)); */
      
      let message ='กรุณาระบุข้อมูลที่เป็นตัวเลข ที่มีความยาวไม่เกิน ' + length + ' หลัก';
      if (scale > 0) {
         // alert('sadddddddddddddd');
        message += 'และมีทศนิยมไม่เกิน ' + scale + ' ตำแหน่ง';
      }
     


      if (!regexp.test(this.removeComma(input))) {
        //alert(message);
        formGroup.get(id).setValue('');
        this.messageError(message);
      }
    }
  }


  removeComma(input: string): string {
    if (input) {
      if (input.toString().indexOf(',') !== -1) {
        const formatted = input.replace(/,/g, '');
        return formatted;
      } else {
        return input;
      }
    } else {
      return null;
    }
  }

}
