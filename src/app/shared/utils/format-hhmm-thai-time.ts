export function formatHHMMThaiTime(input: Date): string {
    const padNumber = num => (num > 9 ? num : `0${num}`);
    if (input) {
        const d = input instanceof Date ? input : new Date(input);
        return `${padNumber(d.getHours())}.${d.getMinutes()}`;
    } else {
        return null;
    }
}
