import { Injectable } from '@angular/core';
import { ColumnFilterModel } from '@shared/models/column-filter-model';

export const OPERATORS = {
  equals: 'equal',
  superior: 'sup',
  equalsOrSuperior: '>=',
  inferior: 'inf',
  equalsOrInferior: '<=',
  differentThan: 'diff',
  like: 'like',
  in: 'in',
  notIn: 'not in',
};

export const TYPES = {
  number: 'number',
  text: 'text',
  date: 'date',
  list: 'list',
};

@Injectable({ providedIn: 'root' })
export class ColumnFilterService {
  currentFilter: any;

  constructor() {}

  updateCurrentFilter(currentFilters: ColumnFilterModel[], newFilters: ColumnFilterModel[]): ColumnFilterModel[] {
    // add/update single operator filter
    if (newFilters.length === 1) {
      const filterIndex = currentFilters.findIndex((item) => item.column === newFilters[0].column);
      if (filterIndex === -1) {
        currentFilters.push(newFilters[0]);
      } else if (newFilters[0].value) {
        currentFilters[filterIndex].value = newFilters[0].value;
      } else {
        currentFilters.splice(filterIndex, 1);
      }
      // remove/add multiple operators filter (date type)
    } else {
      currentFilters = currentFilters.filter((filter: ColumnFilterModel) => filter.column !== newFilters[0].column);
      currentFilters.push(...newFilters);
    }
    return currentFilters;
  }
}
