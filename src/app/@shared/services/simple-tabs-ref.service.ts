import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { MessageService } from 'primeng/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class SimpleTabsRefService {
  tabRef: string = 'domain';
  constructor(private http: HttpClient, private messageService: MessageService) {}

  getAllItems(data: any, tabRefName: string = null): Observable<any> {
    let params = new HttpParams();
    tabRefName = tabRefName == null ? this.tabRef : tabRefName;
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.get<any[]>(`/${tabRefName}/`, { params });
  }
  getItemsByCriteria(data: any, tabRefName: string = null): Observable<any> {
    let params = new HttpParams();
    tabRefName = tabRefName == null ? this.tabRef : tabRefName;
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.get<any[]>(`/${tabRefName}/findByCriteria`, { params });
  }
  deleteItem(denomination: any): Observable<any> {
    return this.http.delete<any>(`/${this.tabRef}/${denomination.id}`, httpOptions);
  }

  addItem(denomination: any): Observable<any> {
    return this.http.post<any>(`/${this.tabRef}/`, denomination, httpOptions);
  }

  editItem(denomination: any, id: number): Observable<any> {
    console.log(id);
    return this.http.put(`/${this.tabRef}/${id}`, denomination, httpOptions);
  }

  prepareFilter(dTFilter: any) {
    let filter = {};
    Object.keys(dTFilter).forEach((key) => {
      if (dTFilter[key].type === 'text') {
        filter[key + '[contains]'] = dTFilter[key].value;
      }
      if (dTFilter[key].type === 'range-date') {
        if (dTFilter[key].operator === 'range') {
          filter[key + '[gte]'] = dTFilter[key].value[0];
          filter[key + '[lte]'] = dTFilter[key].value[1];
        } else {
          filter[key + '[' + dTFilter[key].operator + ']'] = dTFilter[key].value;
        }
      }
      if (dTFilter[key].type === 'multiselect') {
        let values: any[] = [];
        dTFilter[key].value.forEach((item: any) => {
          values.push(item.id);
        });
        if (dTFilter[key].field_type === 'key-array') {
          filter[key + '[in]'] = JSON.stringify(values);
        }
        if (dTFilter[key].field_type === 'key-multiple-data') {
          filter[key + '_id[in]'] = JSON.stringify(values);
        }
      }
    });
    return filter;
  }

  getTabRefFilterData(result: any[]) {
    let items: any[] = [];
    result.forEach((item: any) => {
      if (item.hasOwnProperty('label')) {
        items.push({ id: item.id, name: item.label });
      } else {
        items.push({ id: item.id, name: item.name });
      }
    });
    return items;
  }

  getFormErrors(errors: any, title: string) {
    if (!errors) {
      return;
    }
    Object.keys(errors).forEach((key) => {
      if (Array.isArray(errors[key])) {
        errors[key].forEach((error: any) => {
          this.messageService.add({ severity: 'error', summary: title, detail: error });
        });
      }
    });
  }
}
