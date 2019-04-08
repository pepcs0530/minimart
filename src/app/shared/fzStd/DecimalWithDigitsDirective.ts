import { Directive, ElementRef, HostListener } from '@angular/core';
import { Constant } from '../utils/constant';

@Directive({
    selector: '[decimalWithDigits]'
})
export class DecimalWithDigitsDirective {
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
    private regex: RegExp = new RegExp(/^\d*\.?\d*$/);
    //  with '-' ==>> /^\d+|-$/
    // Key ที่ ยอม ให้ Input ได้
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}

