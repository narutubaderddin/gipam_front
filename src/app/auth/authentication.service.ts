import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '@core/Models/User';
import { JwtService } from '@app/auth/jwt.service';
import { LocalStorageService } from 'angular-2-local-storage';

const TOKEN_KEY = 'user_token';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // constructor(private credentialsService: CredentialsService) {}
  //
  // /**
  //  * Authenticates the user.
  //  * @param context The login parameters.
  //  * @return The user credentials.
  //  */
  // login(context: LoginContext): Observable<Credentials> {
  //   // Replace by proper authentication call
  //   const data = {
  //     username: context.username,
  //     token: '123456',
  //   };
  //   this.credentialsService.setCredentials(data, context.remember);
  //   return of(data);
  // }
  //
  // /**
  //  * Logs out the user and clear credentials.
  //  * @return True if the user was logged out successfully.
  //  */
  // logout(): Observable<boolean> {
  //   // Customize credentials invalidation here
  //   this.credentialsService.setCredentials();
  //   return of(true);
  // }

  currentUser: User;
  authenticated = false;
  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  private static handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(error.error.message);
  }

  getToken(): string {
    return this.localStorageService.get(TOKEN_KEY);
  }

  setToken(token: string) {
    this.localStorageService.set(TOKEN_KEY, token);
  }

  removeToken() {
    this.localStorageService.remove(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() == 'true';
  }

  login(loginRequest: LoginContext): Observable<User> {
    console.log(true);
    this.setToken('true');
    this.authenticated = true;
    return this.http.post<any>('/login_check', loginRequest).pipe(
      map((data: any) => {
        if (data.token) {
          this.currentUser = Object.assign({}, this.jwtService.decodeToken(data.token));
          this.setToken(data.token);
          return this.currentUser;
        }
      }),
      catchError(AuthenticationService.handleError)
    );
  }

  logout() {
    this.removeToken();
    return of(true);
  }

  getCurrentUser() {
    return this.jwtService.decodeToken(this.getToken());
  }
}
