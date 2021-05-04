import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  constructor(private http: HttpClient) {}
  getFields(): Observable<any> {
    return this.http.get('http://localhost:8000/api/fields');
  }
}
