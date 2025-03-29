export default function getCSSVariableValue(varName) {
  if (!varName.startsWith("--")) {
    varName = `--${varName}`;
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}
