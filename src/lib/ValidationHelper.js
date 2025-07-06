
export const removeNonAlphanumericMultispace = (inputString) => {
  return inputString
    .replace(/[^a-zA-Z0-9 ]/g, '') 
    .replace(/\s+/g, ' ');         
}

export const removeNonUrlCharacters = (inputString) => {  // keep only alphanumerics, dot, colon, and slash
  return inputString
    .replace(/[^a-zA-Z0-9./:]/g, '')
    .trim();
}

export const removeSpecialChars = (str) => {
  return str.replace(/(\r\n|\n|\r)/g, "").replace(/"/g, "'");
}

export const validateCharacterLength = (str, requiredLength) => {
  const sanitizedInput = removeNonAlphanumericMultispace(str).trim();
  console.log('requiredLength', requiredLength);
  console.log('sanitizedInput', sanitizedInput);
  const validInput = sanitizedInput && sanitizedInput.length >= requiredLength ? sanitizedInput : false;
  console.log('sanitizedInput.length', sanitizedInput.length);
  console.log('validInput', validInput);
  return validInput;
}
