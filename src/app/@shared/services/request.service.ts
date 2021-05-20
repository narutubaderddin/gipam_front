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
  exportRequest(artWorks: any): Observable<any> {
    return this.http.get('/requests/exportCurrentRequests?artWorks=[' + artWorks + ']', {
      responseType: 'blob',
      observe: 'response',
    });
  }
  manageFileResponseDownload(response: Response | any, content: any) {
    const newBlob = new Blob([response.body], {
      type: response.body.type,
    });
    // file name
    let fileName = content;

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    // window.open(data);
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  exportNotices(requestParams: any = {}, type: string = 'catalogue'): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    //prepare query URL.
    let url = '/artWorks/export/' + type + '?sort_by=' + requestParams.sortBy + '&sort=' + requestParams.sort;
    requestParams.notices.forEach((artWorkId: any) => {
      return (url += '&artWorks[]=' + artWorkId);
    });

    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
