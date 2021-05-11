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
export class RequestService {
  constructor(private http: HttpClient) {}
  newRequest(request: any): Observable<any> {
    return this.http.post<any>('/requests/', request, httpOptions);
  }

  getBuildings(): Observable<any> {
    return this.http.get('/buildings/');
  }
  getLevels(buildingId: string): Observable<any> {
    const listbuildings: any[] = [];
    listbuildings.push(buildingId);
    return this.http.get('/rooms/findRoomsLevelbyCriteria?batiment=[' + buildingId + ']');
  }
  getPiecesNumbers(params: any): Observable<any> {
    const filter: string = '?batiment=' + params.building + '&level=' + params.level;
    return this.http.get('/rooms/findRoomsRefByCriteria' + filter);
  }
  exportRequest(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get('/requests/exportRequest/', {
      responseType: 'blob'
    });
  }
}
