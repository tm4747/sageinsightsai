
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
  const validInput = sanitizedInput && sanitizedInput.length >= requiredLength ? sanitizedInput : false;
  return validInput;
}
