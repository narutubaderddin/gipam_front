import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  constructor(private http: HttpClient, private messageService: MessageService) {}

  updateLinks(data: any, id: any): Observable<any> {
    return this.http.patch(`/photography/${id}`, data);
  }
  updateAttachments(data: any, id: any): Observable<any> {
    console.log(data, id);
    return this.http.patch(`/attachments/${id}`, data);
  }
  deleteAttachments(data: any, id: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.delete<any>(`/attachments/${id}`, { params });
  }
  deleteLinks(data: any, id: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.delete<any>(`/hyperLink/${id}`, { params });
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

  addAttachments(data: any): Observable<any> {
    const params = new HttpParams();
    return this.http.post<any>(`/attachments`, data, { params: params });
  }

  AddLinks(data: any): Observable<any> {
    const params = new HttpParams();
    return this.http.post<any>(`/hyperLink`, data, { params: params });
  }
}
