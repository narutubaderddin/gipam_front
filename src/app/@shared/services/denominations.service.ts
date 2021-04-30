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
export class DenominationsService {
  constructor(private http: HttpClient) {}

  // Get All Denominations
  getAllDenominations(data: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.get<any[]>('/denominations/', { params });
  }

  // Delete Denomination
  deleteDenominations(denomination: any): Observable<any> {
    return this.http.delete<any>(`/denominations/${denomination.id}`, httpOptions);
  }

  // add Denomination
  addDenominations(denomination: any): Observable<any> {
    return this.http.post<any>('/denominations/', denomination, httpOptions);
  }

  // edit Denomination
  editDenominations(denomination: any, id: number): Observable<any> {
    console.log(id);
    return this.http.put(`/denominations/${id}`, denomination, httpOptions);
  }
}
