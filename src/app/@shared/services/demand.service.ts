import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DemandService {
  constructor(private http: HttpClient) {}

  getDemands(params: any): Observable<any> {
    let filter: any = '?limit=5';
    if (params.page) {
      filter += '&page=' + params.page;
    }
    return this.http.get('/requests' + filter);
  }
}
