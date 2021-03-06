import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  statusType = [
    {
      id: 'En cours',
      name: 'En cours',
    },
    {
      id: 'Acceptée',
      name: 'Acceptée',
    },
    {
      id: 'Partiellement_acceptée',
      name: 'Partiellement acceptée',
    },
    {
      id: 'Refusée',
      name: 'Refusée',
    },
    {
      id: 'Annulée',
      name: 'Annulée',
    },
  ];
  constructor(private http: HttpClient) {}

  getDemands(filter: any): Observable<any> {
    return this.http.get('/requests' + filter);
  }
  changeStatus(request: any) {
    const payload = {
      requestStatus: request.requestStatus,
      listArtWorks: request.expandData,
    };
    return this.http.put('/requests/' + request.id, payload);
  }
  getSelectedStatus() {
    let defaultStatus: any[] = [];
    let status: any = this.statusType.find((elm: any) => elm.id == 'En cours');
    defaultStatus.push(status);
    return defaultStatus;
  }
}
