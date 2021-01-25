import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  formatInputList(textData) {
    let noteList = textData.split('\n');
    // 1er filtre
    noteList = noteList.filter((val) => {
      return val.trim() !== '•';
    });
    // 2eme filtre
    noteList = noteList.map((val) => {
      if (val.trim().substr(0, 1) === '•') {
        return val.trim().slice(1).trim();
      }
      return val.trim();
    });
    // 3eme filtre
    noteList = noteList.filter((val) => {
      return val.trim() !== '';
    });
    return noteList;
  }
}
