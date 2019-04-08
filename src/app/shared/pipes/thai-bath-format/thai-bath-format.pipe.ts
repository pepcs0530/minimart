import { Pipe, PipeTransform } from '@angular/core';
import { removeComma } from '../../utils/remove-comma';



@Pipe({ name: 'thaiBathFormat' })
export class ThaiBathFormatPipe implements PipeTransform {
   transform(value: number): string {
     if (value) {
      const format = removeComma(value.toString());
      return parseFloat(format)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
     } else {
       return null;
     }
   }

  /* transform(value) {
    return addComma(removeComma(value));
  } */
}
