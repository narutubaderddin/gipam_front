import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, tap } from 'rxjs/operators';

const baseUrl = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class FieldsService {
  constructor(private http: HttpClient) {}

  // Get All Feilds
  getAllFields(data: any): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });

    return this.http.get<any[]>(baseUrl + 'api/fields/', { params });
  }

  // Delete Field
  deleteField(field: any): Observable<any> {
    return this.http.delete<any>(baseUrl + `api/fields/${field.id}`, httpOptions);
  }

  // add Field
  addField(field: any): Observable<any> {
    return this.http.post<any>(baseUrl + 'api/fields/', field, httpOptions);
  }

  // edit Field
  editField(field: any, id: number): Observable<any> {
    console.log(id);
    return this.http.put(baseUrl + `api/fields/${id}`, field, httpOptions);
  }
}
