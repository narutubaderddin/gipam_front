import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formValue',
})
export class FormValuePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: any, ...args: unknown[]): any {
    if (Array.isArray(value)) {
      let result = '';
      value.forEach((items, index) => {
        if (items instanceof Date) {
          result = this.datePipe.transform(value[0], 'dd/MM/yyyy');
          if (index < result.length) {
            result += ',';
          }
        }
        if (items && items.hasOwnProperty('name')) {
          result += items.name;
        }
      });
      return result;
    }
    return value;
  }
}
