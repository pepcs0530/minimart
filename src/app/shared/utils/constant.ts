export class Constant {
    public numberOnly?: RegExp = /^\d+$/;
    public decimalWithDigits?: RegExp = /^[0-9\.]+$/;
    public blockSpecial?: RegExp = /^[^<>*!,]+$/;
}
