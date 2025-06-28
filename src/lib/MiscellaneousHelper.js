export const removeIntroMaterial = (str) => {
    const index = str.indexOf("Here is your story");
    return str.substring(index);
}