function checkStrength(value: string) {
  setPassword(value);
  let strength = "Weak";
  if (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  ) {
    strength = "Strong";
  } else if (value.length >= 6 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value)) {
    strength = "Medium";
  }
  setPasswordStrength(strength);
}