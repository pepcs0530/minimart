export function removeComma(input: any): string {
  if (input) {
    if (input.toString().indexOf(',') !== -1) {
      const formatted = input.replace(/,/g, '');
      return formatted;
    } else {
      return input;
    }
  } else {
    return null;
  }
}
