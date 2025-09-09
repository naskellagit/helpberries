function generateBoxBarcode(number) {
  const prefix = "HB";
  const numberPart = String(number).padStart(6, "0");
  return prefix + numberPart;
}

export default generateBoxBarcode