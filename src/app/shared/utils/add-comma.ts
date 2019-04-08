export function addComma(input: any): string {
  if (input) {
    const formatted = parseFloat(input.toString())
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return formatted;
  } else {
    return null;
  }
}
