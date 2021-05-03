import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
export const datePickerDateFormat = 'yyyy-MM-dd';
export const viewDateFormat = 'dd/MM/yyyy';

export function markAsTouchedDeep(control: AbstractControl): void {
  control.markAsTouched();

  if (control.hasOwnProperty('controls')) {
    Object.keys((<any>control).controls).forEach((item) => {
      markAsTouchedDeep((<any>control).controls[item]);
    });
  }
}

export function markAsDirtyDeep(control: AbstractControl): void {
  control.markAsDirty();

  if (control.hasOwnProperty('controls')) {
    Object.keys((<any>control).controls).forEach((item) => {
      markAsDirtyDeep((<any>control).controls[item]);
    });
  }
}

export function towDatesCompare(startDateName: string, disappearanceDateName: string): ValidatorFn {
  return (cc: FormGroup): ValidationErrors => {
    if (!cc.get(startDateName)) {
      return null;
    }
    if (cc.get(startDateName).value >= cc.get(disappearanceDateName).value) {
      return { dateInvalid: 'Date début supérieur ou égale à date fin' };
    }
    return null;
  };
}
