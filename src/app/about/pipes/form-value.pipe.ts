import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formValue',
})
export class FormValuePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    if (Array.isArray(value)) {
      let result = '';
      value.forEach((items, index) => {
        result += items.name;
        if (index < result.length) {
          result += ',';
        }
      });
      return result;
    }
    return value;
  }
}
