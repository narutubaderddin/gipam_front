import { Observable, of, throwError } from 'rxjs';
import { DUMMY_TOKEN } from '@shared/utils/data.mock';

export class MockAuthenticationService {
  credentials: any = {
    username: 'user',
    password: 'user',
  };

  login(context: any): Observable<any> {
    if (context.username === 'user' && context.password === 'user') {
      return of({
        username: context.username,
        token: DUMMY_TOKEN.token,
      });
    } else {
      return throwError(
        of({
          message: 'wrong credentials',
        })
      );
    }
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  getCurrentUser() {
    return { username: 'user', roles: ['ROLE_USER'] };
  }
}
