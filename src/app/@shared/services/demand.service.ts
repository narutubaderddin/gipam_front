import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
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
  changeStatus(request:any){
    const payload = {
      requestStatus : request.requestStatus
    }
    return this.http.patch('/requests/' + request.id,payload);
  }
}
