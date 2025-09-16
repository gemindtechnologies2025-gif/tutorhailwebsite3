export const isString = (val: any) => {
  if (val.includes(".")) {
    return true;
  }
  if (val.length === 1 && val === " ") {
    return false;
  }
  if (
    val[val.length - 1] === " " &&
    val[val.length - 1] !== val[val.length - 2]
  ) {
    return true;
  }
  if (
    val[val.length - 1]?.trim()?.toLowerCase() !==
      val[val.length - 1]?.trim()?.toUpperCase() ||
    val === ""
  ) {
    return true;
  }
  return false;
};
export const isFloat = (val: any) => {
  if (val[val.length - 1] === " " || val === "." || val === "0") {
    return false;
  }
  if (val.includes(".")) {
    val = val.replace(".", "");
    // eslint-disable-next-line no-restricted-globals
    if ((!val.includes(".") && !isNaN(val?.trim())) || val === "") {
      return true;
    }
    return false;
  }
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(val?.trim()) || val === "") {
    return true;
  }
  return false;
};
export const isNumber = (val: any) => {
  if (val[val.length - 1] === " ") {
    return false;
  }
  if (val.includes(".")) {
    return false;
  }
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(val?.trim()) || val === "") {
    return true;
  }
  return false;
};

export const isValidInput = (value: string) => {
  if (value === "") {
    return true;
  }
  if (value.trim() === "") {
    return false; // Reject if the value is empty or only consists of whitespace
  }

  if (value.includes("  ") || value.includes("..")) {
    return false; // Reject if there are consecutive spaces or decimals
  }

  return true; // Accept the input if it meets all the conditions
};



export function convertToInternationalCurrencySystem(labelValue: number) {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + " B"
    : // Ssix Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + " M"
      : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + " K"
        : Math.abs(Number(labelValue));
}