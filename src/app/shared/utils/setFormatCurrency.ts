import { removeComma } from './remove-comma';

// input จะต้องใส่ directive ชื่อ currency
// เช่น <input type="text" currency />

// ui ส่งค่าที่มี comma เข้ามา เช่น 12,345.456
// จะถูกแปลงเป็น 12345.46 (ทศนิยม 2 ตำแหน่ง) ก่อนส่งไปบันทึก
export function setFormatCurrency(input: any): string {
    if (input) {
        const before = removeComma(input.toString());
        const formatted = parseFloat(before)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');

        const after = removeComma(formatted);
      return after;
    } else {
      return null;
    }
}