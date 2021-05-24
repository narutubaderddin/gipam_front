import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PhotographyService {
  constructor(private http: HttpClient, private messageService: MessageService) {}

  addPhotography(data: any): Observable<any> {
    const params = new HttpParams();
    return this.http.post<any>(`/photography`, data, {params:params});
  }
  updatePhotography(data: any, id: any): Observable<any> {
    return this.http.patch(`/photography/${id}`, data);
  }
  deletePhotography(data: any, id: any) : Observable<any> {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.delete<any>(`/photography/${id}`, {params});
  }
  getFormErrors(errors: any, sum: string) {
    if (!errors) {
      return;
    }
    Object.keys(errors).forEach((key) => {
      if (Array.isArray(errors[key])) {
        errors[key].forEach((error: any) => {
          this.messageService.add({ severity: 'error', summary: sum, detail: error });
        });
      }
    });
  }


}
