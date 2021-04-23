import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

const baseUrl = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class StylesService {
  constructor(private http: HttpClient) {}

  // Get All styles
  getAllItems(data: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.get<any[]>(baseUrl + 'api/styles/', { params });
  }

  // Delete style
  deleteItem(denomination: any): Observable<any> {
    return this.http.delete<any>(baseUrl + `api/styles/${denomination.id}`, httpOptions);
  }

  // add style
  addItem(denomination: any): Observable<any> {
    return this.http.post<any>(baseUrl + 'api/styles/', denomination, httpOptions);
  }

  // edit style
  editItem(denomination: any, id: number): Observable<any> {
    console.log(id);
    return this.http.put(baseUrl + `api/styles/${id}`, denomination, httpOptions);
  }
}
