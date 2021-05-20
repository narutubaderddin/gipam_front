import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
