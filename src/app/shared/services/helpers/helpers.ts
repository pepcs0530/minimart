import { Injectable } from "@angular/core";
import { FormGroup, AbstractControl } from "@angular/forms";

@Injectable({
    providedIn: "root"
})
export class HelpersService {

    private _keyStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    private _base64 = {
        encode: this.encodeBase64(),
        decode: this.decodeBase64()
    };

    cancel(formParam: FormGroup) { }

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

    setFormByData(form: FormGroup, data: any) {
        form.patchValue(data);
        this.cancel = formParam => formParam.patchValue(data);
        return form;
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

                // tslint:disable-next-line:no-bitwise
                enc1 = chr1 >> 2;
                // tslint:disable-next-line:no-bitwise
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                // tslint:disable-next-line:no-bitwise
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                // tslint:disable-next-line:no-bitwise
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

                // tslint:disable-next-line:no-bitwise
                chr1 = (enc1 << 2) | (enc2 >> 4);
                // tslint:disable-next-line:no-bitwise
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                // tslint:disable-next-line:no-bitwise
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
                // tslint:disable-next-line:no-bitwise
                utftext += String.fromCharCode((c >> 6) | 192);
                // tslint:disable-next-line:no-bitwise
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                // tslint:disable-next-line:no-bitwise
                utftext += String.fromCharCode((c >> 12) | 224);
                // tslint:disable-next-line:no-bitwise
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                // tslint:disable-next-line:no-bitwise
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
                // tslint:disable-next-line:no-bitwise
                decodedText += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = encodedText.charCodeAt(i + 1);
                c3 = encodedText.charCodeAt(i + 2);
                // tslint:disable-next-line:no-bitwise
                decodedText += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return decodedText;
    }

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
