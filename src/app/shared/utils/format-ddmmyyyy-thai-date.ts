export function formatDDMMYYYYThaiDate(input: Date): string {
    const padNumber = num => (num > 9 ? num : `0${num}`);
    if (input) {
        const d = input instanceof Date ? input : new Date(input);
        return `${padNumber(d.getDate())}/${padNumber(d.getMonth() + 1)}/${d.getFullYear() + 543}`;
    } else {
        return null;
    }
}
