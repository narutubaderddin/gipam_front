import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function dateCompareValidator(startDate: string, endDate: string, msg: string): ValidatorFn {
  console.log('validator', startDate, endDate);
  // if (!startDate || !endDate) {
  //   return null;
  // }
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (startDate < endDate) {
      return { forbiddenName: { value: msg } };
    }
    return null;
  };
}

@Directive({
  selector: '[appDateCompare]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateCompareDirective, multi: true }],
})
export class DateCompareDirective implements Validator {
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() errorMessage = 'start date lower than end date';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.startDate ? dateCompareValidator(this.startDate, this.endDate, this.errorMessage)(control) : null;
  }
}
