import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
export const datePickerDateFormat = 'yyyy-MM-dd';
export const viewDateFormat = 'dd/MM/yyyy';
export const tabRefFormBackendErrorMessage = 'Erreur de validation';
export const lastArtOfWorkDetailIndex = 'lastArtOfWorkDetailIndex';
export const searchPageFilter = 'searchPageFilter';

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
  return (formGroup: FormGroup): ValidationErrors => {
    if (!formGroup.get(startDateName)) {
      return null;
    }
    if (formGroup.get(startDateName).value >= formGroup.get(disappearanceDateName).value) {
      return { dateInvalid: 'Date début supérieur ou égale à date fin' };
    }
    return null;
  };
}

export function oneOfTheseFields(...fields: string[]): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    let empty = true;
    for (const item of fields) {
      if (Array.isArray(formGroup.get(item).value)) {
        if (formGroup.get(item).value.length !== 0) {
          empty = false;
          break;
        }
      } else {
        if (formGroup.get(item).value) {
          empty = false;
          break;
        }
      }
    }
    if (empty) {
      return { oneOfTheseFields: 'One of these fields' + fields.join(', ') + 'is needed' };
    }
    return null;
  };
}

export function getMultiSelectIds(results: any[]) {
  const items: any[] = [];
  results?.forEach((item: any) => {
    items.push(item.id);
  });
  return items;
}
