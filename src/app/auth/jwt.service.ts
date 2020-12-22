import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  helper: JwtHelperService;

  constructor() {
    this.helper = new JwtHelperService();
  }

  isTokenExpired(token: string) {
    return this.helper.isTokenExpired(token);
  }

  decodeToken(token: string) {
    return this.helper.decodeToken(token);
  }
}
