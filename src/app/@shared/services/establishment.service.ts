import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  constructor(private http: HttpClient) {}
  getEstablishments(param: any = null): Observable<any> {
    let filter: string = '?';
    if (param) {
      if (param.label) {
        filter += 'label[contains]=' + param.label;
      }
    }
    return this.http.get('/establishments' + filter);
  }

  getSubDirections(params: any): Observable<any> {
    let filter = '?';
    if (params.establishmentId) {
      filter += 'establishment[eq]=' + params.establishmentId;
    }
    if (params.label) {
      filter += '&label=' + params.label;
    }
    return this.http.get('/subDivisions' + filter);
  }
}
