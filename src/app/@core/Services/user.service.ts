import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  checkMailExistance(email: string) {
    const url = '/user/inscription/';
    return this.http.get(url + email);
  }
}
