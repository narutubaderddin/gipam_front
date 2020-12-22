import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtService } from '@app/auth/jwt.service';

const DUMMY_TOKEN = {
  token:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NDY0MjQ1MzgsImV4cCI6MTU3Nzk2MDUzOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.fZggIuqTVElmkG_HRQCCk3qEYmACMAPng5ljHleBTeg',
  expiredToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NDQ3ODIxMjMsImV4cCI6MTU0NDc4NTcyMywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZGNsZW1lbnQiLCJlbWFpbCI6IiIsImlkIjoiIn0.lmr9k3-ZhAcVRGXLIbKnZaONNRv9Qnq-41OLsOQZ_eAtK3E6tVYQnI_-BLubNJnHQCHtwIjjsmqK9tEcZ84WThXVXIT8RdLQ6W69rNn1yYnPBhxWpeHn6bkIaZAOjcj_KSIy4q5mnpoHfxaCz-E8RlMvU9q5lRxYIzZyC61D1qTMwQpRafeS89DTNuGiD_BOwP9xUD4ILPl4C7SN4785hCAf983dZr2qLpg4O1G1dgndO97ZYdNcDMK--houl33Xq4GSVGF1wKLk-tuSdRT29yi64wBNgLjLbsifHuxQH_wLryf8ZYu4aS3I7csy6NBwD7P6CIed23J0Frc4sAMzFgCufLa8McIo-uiOhGAiu8pUeSQKvgz7TPvVeytiMqKwEVrA3m2e3nBP4YDpPvg6VnEJ4lSEhcwaRFgC7hrEH8BqAl4fliaMrP6uqX0F3IAVg0DecjaNZRba7hQdSq5gAUV3zbn5sUson6ZqxhVnrOCLyKl3DRKj3GC7148WOUI-PSSzHoE7MNkT0P2_oGnVraJRKLffqEbbtTX24a5iwvosrnhmnGBWp33rjdUkYG67eqwuMKTJN59Ws1V154onucX1kpvuBG4bOaAAsV0LoSj9xErambQmPOUykERxuv6Vdx8F6eg8laLA22e8_ityrmRfczATRjXh_Lm9XIrm0bE',
};

describe('InbTypeService', () => {
  let injector: TestBed;
  let jwtService: JwtService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });

    injector = getTestBed();
    jwtService = injector.get(JwtService);
  });

  afterEach(() => {});

  it('should be created', () => {
    expect(jwtService).toBeTruthy();
  });

  it('should return false if token is not expired ', () => {
    expect(jwtService.isTokenExpired(DUMMY_TOKEN.token)).toBeFalsy();
  });

  it('should return true if token is expired ', () => {
    expect(jwtService.isTokenExpired(DUMMY_TOKEN.expiredToken)).toBeTruthy();
  });

  it('should return user object  from decoded token ', () => {
    expect(typeof jwtService.decodeToken(DUMMY_TOKEN.token)).toBe('object');
  });
});
