import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '@app/auth/authentication.service';
import { JwtService } from '@app/auth/jwt.service';
import { of } from 'rxjs';
import {
  DUMMY_TOKEN,
  DUMMY_USER,
  INVALID_LOGIN_RESPONSE,
  LOGIN_ERROR_RESPONSE,
  LOGIN_REQUEST,
} from '@shared/utils/data.mock';

describe('AuthenticationService', () => {
  let injector: TestBed;
  let authService: AuthenticationService;
  let httpMock: HttpTestingController;
  let helper: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          prefix: 'my-app',
          storageType: 'localStorage',
        }),
      ],
      providers: [LocalStorageService, JwtService],
    });
    injector = getTestBed();
    authService = injector.get(AuthenticationService);
    httpMock = injector.get(HttpTestingController);
    helper = new JwtHelperService();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('setToken', () => {
    it('should store the token in localStorage', () => {
      authService.setToken(DUMMY_TOKEN.token);
      expect(authService.getToken()).toEqual(DUMMY_TOKEN.token);
    });
  });

  describe('removeToken', () => {
    it('should remove stored token from localStorage', () => {
      authService.removeToken();
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when the token is not expired', () => {
      authService.setToken(DUMMY_TOKEN.token);
      expect(authService.isAuthenticated()).toBeTruthy();
    });
    it('should return false when the token is  expired', () => {
      authService.setToken(DUMMY_TOKEN.expiredToken);
      expect(authService.isAuthenticated()).toBeFalsy();
    });
  });

  describe('logIn', () => {
    it('should login user with proper username and password', () => {
      spyOn(authService, 'login').and.returnValue(of(DUMMY_USER));
      authService.login(LOGIN_REQUEST).subscribe((currentUser) => {
        expect(currentUser.username).toEqual(LOGIN_REQUEST.username);
      });
    });

    it('should store the token in localStorage when user is successfully logged in ', () => {
      spyOn(authService, 'login').and.returnValue(of(DUMMY_USER));
      authService.login(LOGIN_REQUEST).subscribe((currentUser) => {
        expect(authService.getToken()).toBeDefined();
      });
    });

    it('should not login user with invalid username or password', () => {
      spyOn(authService, 'login').and.returnValue(of(LOGIN_ERROR_RESPONSE));
      authService.login(INVALID_LOGIN_RESPONSE).subscribe((data) => {
        expect(data['message']).toBeDefined();
      });
    });
  });

  describe('logout', () => {
    it('should remove token when logging out', () => {
      authService.logout();
      expect(authService.getToken()).toBeNull();
    });
  });
});
