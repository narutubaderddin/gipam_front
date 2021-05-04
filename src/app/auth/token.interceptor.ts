import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
//import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MjAwODE0MDIsImV4cCI6MTYyMDA4NTAwMiwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9DT0xMQUJPUkFUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkB0YWxhbi5jb20ifQ.GaYlllVxZboZtEEeZwEseEO9z_nuW40ka3WpYg1eI3KwyXt-3F7-zDiML43zVuS8GQnD_CVFROn7a2iwFWExE5mKfreBHzVner1p-Vag3LXqVPUOT6muIX-b7BbjD0XzUWvI4QAt_flJGpLjtYnYxSKeAqG2QsN342y7jeNtEvIdvtK9IggV3plm-XutKQ8lTwxxbKeXTT8ev3Ql87WBb1YGyQzXDlCY8wbaUEKSzcdIFhJ-n30zUckJQK1LC9vLoPqSJLDpc_frob_j-c7XGSZWMzCkcpuALLtTujvlRBv_MWFqjvQcliYR8qxOdeTZDD1pPfgdlH_RuvtiCNCR4_iHZMDUoyErsRmHS0R840W-qvmkuJIZ1UWJpe_dFtGbf9eZIJrnZAghcHgDauzX0mHvsQ9Pn86H2F1b7jg9uA6Sgr13SAmCs5TBQE-NMAeVNPZyL1WdUvBeTcTs2o_23K1JUCPBVmE9FTy1XvPgQedE4esTemR3XpXjaoeHdkSgBHlG1ULFT93PrXsmTQAeBFesmVQqTgNs18jlm7t_BbqO8ic8lb1cy2kqOle5h0JVyXmdvQnLQZGoumDbH7sPjfKKdJvWoG-lJtPvi2UTkEOGK33tRqFcGCBsrNDaEHyGgzKmMXZmzjojnmOwgk3X_dwAx3rdqv2vB22RvEcecLM';
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(request);
  }
}
