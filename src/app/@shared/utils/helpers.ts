import { AbstractControl } from '@angular/forms';

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
