import { Directive, ElementRef, HostListener } from '@angular/core';
import { addComma } from '../utils/add-comma';
import { removeComma } from '../utils/remove-comma';

@Directive({
    selector: '[currency]'
})

export class CurrencyDirective {
    // 123 --> would all be valid
    // 123.  --> would all be valid
    // 123.4  --> would all be valid
    // 123.. --> would be invalid

    /*
        ^ - Beginning of the line;
        \d* - 0 or more digits;
        \.? - An optional dot (escaped, because in regex, . is a special character);
        \d* - 0 or more digits (the decimal part);
        $ - End of the line.
    */
   private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/);
   //  with '-' ==>> /^\d+|-$/
   // Key ที่ ยอม ให้ Input ได้
   private specialKeys: Array<string> = [
       'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight',
       '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'
    ];

   constructor(private el: ElementRef) {
   }

   @HostListener('keydown', ['$event'])
   onKeyDown(event: KeyboardEvent) {
       console.log('event.key-->', event.key);
       if (this.specialKeys.indexOf(event.key) !== -1) {
           return;
       } else {
            event.preventDefault();
       }
       // const current: string = this.el.nativeElement.value;
       // const next: string = current.concat(event.key);
       /*if (next && !String(next).match(this.regex)) {
           event.preventDefault();
       }*/
   }

    /*@HostListener('ngModelChange', [ '$event']) onNgModelChange(value) {
        console.log('ngModelChange-->', value);
        if (value) {
            const formatted = addComma(removeComma(value));
            this.el.nativeElement.value = formatted;
        }
        // this.elementRef.nativeElement.value = this.formatcurrencypipe.transform(value);
    }*/

    @HostListener('blur', ['$event.target.value']) onBlur(value) {
        console.log('blur-->', value);
        if (value) {
            // const formatted = removeComma(addComma(value));
            const formatted = addComma(removeComma(value));
            this.el.nativeElement.value = formatted;
        } else {
            this.el.nativeElement.value = null;
        }
        // this.elementRef.nativeElement.value = this.formatcurrencypipe.transform(value);
    }
}
