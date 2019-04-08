import { HttpParams } from '@angular/common/http';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Injectable, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private _keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  private _base64 = {
    encode: this.encodeBase64(),
    decode: this.decodeBase64()
  };

  private NUMBER_PATTERN = /[0-9]+/g;
  private LOV_DISPLAY_PATTERN = /(\{[0-9]+(\|[A-Za-z_]+)+\})|(\{[0-9]+\})/g;
  private FORMATTEXT_PATTERN_WITH_PIPE = /\{[0-9]+(\|[A-Za-z_]+)+\}/g;

  get Base64() {
    return this._base64;
  }

  mapModelToQueryParams<T>(model: T, ignoreSearchParam = false): HttpParams {
    let params = new HttpParams();
    if (!!model) {
      Object.keys(model).map(key => {
        if (model[key]) {
          params = params.set(
            key,
            key === 'search' && !ignoreSearchParam
              ? `%${model[key]}%`
              : model[key]
          );
        }
      });
    }
    return params;
  }

  isEmptyObject(object: any) {
    return Object.keys(object).map(key => key).length === 0;
  }

  isEmptyList<T>(list: T[]) {
    return list.length === 0;
  }

  copyFormGroup(targetForm: FormGroup) {
    const formDataProps: string[] = Object.keys(targetForm.value);
    const resFormData = new FormGroup({});
    formDataProps.forEach(dataProps => {
      resFormData.addControl(dataProps, targetForm.get(dataProps));
    });
    return resFormData;
  }

  mapModelToSaveParam<T>(model: T) {
    Object.keys(model).map(key => {
      if (Object.prototype.toString.call(model[key]) === '[object Date]') {
        model[key] = new Date(model[key]).getTime();
      }
    });
    return model;
  }

  findValueFromObject(props: string, object: object) {
    for (const key in object) {
      if (typeof object[key] === 'object') {
        return this.findValueFromObject(props, object[key]);
      } else if (key === props) {
        return object[props];
      }
    }
  }

  removeUrlFragment(uriList: string[]) {
    return uriList.map(
      uri => (!uri.includes('#') ? uri : uri.substring(0, uri.indexOf('#')))
    );
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

  compareObject(pivot: object, target: object) {
    let valid = true;
    for (const key of Object.keys(pivot)) {
      valid = pivot[key] === target[key] && valid;
    }
    return valid;
  }

  flattenObject(data: object) {
    const objectTypeData = Object.keys(data)
      .filter(
        key => !(data[key] instanceof Array) && data[key] instanceof Object
      )
      .map(key => data[key]);
    let flattenData = Object.keys(data)
      .filter(key => !(data[key] instanceof Object))
      .reduce((values, key) => ({ ...values, [key]: data[key] }), {});
    if (objectTypeData.length === 0) {
      return data;
    }
    for (const value of objectTypeData) {
      flattenData = { ...flattenData, ...this.flattenObject(value) };
    }
    return flattenData;
  }

  formatDisplayTemplate(
    displayFields: string[],
    data: object,
    template: string,
    pipes?: { [name: string]: { pipe: PipeTransform; params?: any[] } }
  ) {
    if (!data) {
      return '';
    }
    const fmtPatterns = template.match(this.LOV_DISPLAY_PATTERN);
    const fmtPos = template.match(this.NUMBER_PATTERN);
    fmtPatterns.forEach((pattern, i) => {
      const displayFieldPos = fmtPos[i];
      const fieldName = displayFields[+displayFieldPos];
      let targetValue;
      const normalizedPattern = pattern.replace(/ /g, '');
      if (normalizedPattern.search(this.FORMATTEXT_PATTERN_WITH_PIPE) > -1) {
        targetValue = this._appliedPipes(
          data[fieldName],
          normalizedPattern,
          pipes
        );
      } else {
        targetValue = data[fieldName];
      }
      template = template.replace(pattern, targetValue);
    });
    return template;
  }

  private _appliedPipes(
    value: any,
    formatText: string,
    pipes: { [name: string]: { pipe: PipeTransform; params?: any[] } }
  ) {
    const pipeNameList = this.getPipeNameListFromFormatText(formatText);
    let transformedValue;
    if (pipeNameList.length > 0 && !!pipes) {
      for (const pipeName of pipeNameList) {
        if (!!pipes[pipeName]) {
          const { pipe, params } = pipes[pipeName];
          transformedValue = pipe.transform(value, ...(params || []));
        }
      }
    }

    return transformedValue;
  }

  getPipeNameListFromFormatText(formatText: string) {
    return formatText.match(/[A-Za-z_]+/g) || [];
  }

  getFormCondition(formValue: object, conditionFields: string[]) {
    if (
      !formValue ||
      !conditionFields ||
      Object.values(formValue).length === 0 ||
      conditionFields.length === 0
    ) {
      return {};
    } else {
      return conditionFields.reduce((acc, field) => {
        const searchField = this.getSearchField(field);
        const value = get(formValue, searchField);
        return !!value ? this.appendCondition(acc, field, value) : acc;
      }, {});
    }
  }

  getFormControlKeys(formGroup: FormGroup, previousField?: string) {
    let keys = [];
    for (const key of Object.keys(formGroup.controls)) {
      const traverseKey = !!previousField ? `${previousField}.${key}` : key;
      if (
        !!formGroup.get(key) &&
        formGroup.get(key) instanceof FormGroup &&
        !Array.isArray(formGroup.get(key).value)
      ) {
        keys = [
          ...keys,
          ...this.getFormControlKeys(
            formGroup.get(key) as FormGroup,
            traverseKey
          )
        ];
      } else {
        keys = [...keys, traverseKey];
      }
    }
    return keys;
  }

  encodeBase64() {
    return input => {
      let output = '';
      let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      let i = 0;

      input = this.UTF8Encode(input);

      while (true) {
        if (i >= input.length) {
          break;
        }

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output =
          output +
          this._keyStr.charAt(enc1) +
          this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) +
          this._keyStr.charAt(enc4);
      }

      return output;
    };
  }

  decodeBase64() {
    return input => {
      let output = '';
      let chr1, chr2, chr3;
      let enc1, enc2, enc3, enc4;
      let i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

      while (true) {
        if (i >= input.length) {
          break;
        }

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }
      }

      output = this.UTF8Decode(output);

      return output;
    };
  }

  private UTF8Encode(inputString) {
    inputString = inputString.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < inputString.length; n++) {
      const c = inputString.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  private UTF8Decode(encodedText) {
    let decodedText = '';
    let i = 0;
    let c = 0,
      c2 = 0,
      c3 = 0;

    while (i < encodedText.length) {
      c = encodedText.charCodeAt(i);

      if (c < 128) {
        decodedText += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = encodedText.charCodeAt(i + 1);
        decodedText += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = encodedText.charCodeAt(i + 1);
        c3 = encodedText.charCodeAt(i + 2);
        decodedText += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }

    return decodedText;
  }

  private appendCondition(condtion: object, condtionField: string, value: any) {
    return {
      ...condtion,
      [this.getConditionField(condtionField)]: value
    };
  }

  getSearchField(field: string) {
    return field.toLowerCase().includes(' as ')
      ? field.split(' as ')[0]
      : field;
  }

  private getConditionField(field: string) {
    if (field.toLowerCase().includes(' as ')) {
      return field.split(' as ')[1];
    } else {
      return field.includes('.') ? field.split('.').reverse()[0] : field;
    }
  }

  /*
    "tbSupplier": {
      "supCode": "NIT1",
      "label": "นิสสัน เทรดดิ้ง ไทยแลนด์ จำกัด",
      "value": 2
    }

    เช่น ต้องการค่า supCode จาก this.saveForm.get('tbSupplier').value
    จะได้
    const supCode = getValueFromAbstractControl(this.saveForm.get('tbSupplier').value, 'supCode');
  */
  getValueFromAbstractControl(value: AbstractControl, field: string) {
        if (value) {
          console.log('getValueFromAbstractControl => ', value);
          if (typeof value === 'object' && value !== null) {
            return value[field];
          } else {
            return value;
          }
          return value;
        } else {
          console.log('getValueFromAbstractControl => ', value);
          return null;
        }
  }

  /*
    จัด format
    const condition = {
      ordermSerial: 1,
      invoiceNo: '5369',
    };

    var t = inspect(condition, true);
    console.log(t.join('&'));   =>  1&5369

    var s = inspect(condition, false);
    console.log(s.join('&'));   =>  ordermSerial=1&invoiceNo=5369

    */
   formatParamsToString(o, props) {
    let temp = [];
    for (const p in o) {
    if (o.hasOwnProperty(p)) {
        if (typeof o[p] === 'object') {
            temp = temp.concat(this.formatParamsToString(o[p], props));
    } else {
        const str = (props) ? o[p] : p.concat('=', o[p]);
        temp.push(str);
        }
    }
    }
    return temp.join('&');
}
}
