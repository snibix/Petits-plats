// function qui retire les acsent
export function transformNormalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
