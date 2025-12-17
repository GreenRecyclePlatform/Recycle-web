import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordUpperValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUppercase = /[A-Z]/.test(value);
  const passwordValid = hasUppercase;

  return passwordValid ? null : { passwordUpper: true };
}
