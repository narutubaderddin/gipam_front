import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

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
  constructor(private http: HttpClient) {}

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
    return this.http.get<any[]>(`/${tabRefName}/findByCriteria/`, { params });
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
}
