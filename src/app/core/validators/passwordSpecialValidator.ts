import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordSpecialValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasSpecial = /[!@#$%^&*()_+={}[\]|\\:;"'<>,.?/-]/.test(value);

  const passwordValid = hasSpecial;

  return passwordValid ? null : { passwordSpecial: true };
}
