import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { tap } from 'rxjs/operators';

const baseUrl = environment.baseUrl;
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
  getAllDenominations(): Observable<any> {
    const params = new HttpParams().set('limit', '5').set('page', '1');

    return this.http.get<any[]>(baseUrl + 'api/denominations/', { params });
  }

  // Delete Denomination
  deleteDenominations(denomination: any): Observable<any> {
    return this.http.delete<any>(baseUrl + `api/denominations/${denomination.id}`, httpOptions);
  }

  // add Denomination
  addDenominations(denomination: any): Observable<any> {
    return this.http.post<any>(baseUrl + 'api/denominations/', denomination, httpOptions);
  }

  // edit Denomination
  editDenominations(denomination: any, id: number): Observable<any> {
    console.log(id);
    return this.http.put(baseUrl + `api/denominations/${id}`, denomination, httpOptions);
  }
}
