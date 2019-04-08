export function formatThaiDate(input: Date): string {
    const padNumber = num => (num > 9 ? num : `0${num}`);
    const thmonth = new Array(
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    );

    if (input) {
        const d = input instanceof Date ? input : new Date(input);
        return `${padNumber(d.getDate())} ${thmonth[d.getMonth()]} ${d.getFullYear() + 543}`;
    } else {
        return null;
    }
}
