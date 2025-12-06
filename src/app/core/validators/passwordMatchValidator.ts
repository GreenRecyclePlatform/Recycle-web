import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordField: string, confirmField: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.get(passwordField);
    const confirm = form.get(confirmField);

    if (!password || !confirm) return null;

    if (confirm.errors && !confirm.errors['passwordMismatch']) {
      return null;
    }

    if (password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
    } else {
      confirm.setErrors(null);
    }

    return null;
  };
}
