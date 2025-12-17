import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordLowerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasLowercase = /[a-z]/.test(value);

  const passwordValid = hasLowercase;

  return passwordValid ? null : { passwordLower: true };
}
