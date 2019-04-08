import { Pipe, PipeTransform } from '@angular/core';

const padNumber = num => (num > 9 ? num : `0${num}`);
@Pipe({
  name: 'dateThaiFormatDDMMYYYY'
})
export class DateThaiFormatDDMMYYYYPipe implements PipeTransform {
  transform(value: string | number, args?: any) {
    let date, month, beYear;
    if (!!value) {
      if (typeof value === 'number') {
        date = padNumber(new Date(value).getDate());
        month = padNumber(new Date(value).getMonth() + 1);
        beYear = new Date(value).getFullYear() + 543;
      } else {
        const regxp = /\-/gi;
        value = value.replace(regxp, '');
        // console.log('value-->', value);
        date = value.substr(6, 2);
        month = value.substr(4, 2);
        beYear = parseInt(value.substr(0, 4), 10) + 543;
      }
      return date + '/' + month + '/' + beYear;
    } else {
      return '';
    }
  }
}
