export function formatYYYYMMDDThaiDate(input: Date): string {
    const padNumber = num => (num > 9 ? num : `0${num}`);
    if (input) {
        const d = input instanceof Date ? input : new Date(input);
        return `${d.getFullYear() + 543}${padNumber(d.getMonth() + 1)}${padNumber(d.getDate())}`;
    } else {
        return null;
    }
}
