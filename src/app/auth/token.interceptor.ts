import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
//import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MjAwNTcwNTAsImV4cCI6MTYyMDA2MDY1MCwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9DT0xMQUJPUkFUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkB0YWxhbi5jb20ifQ.QThdh-bDK37EiZ9UMkOl-xFzzSh9N39PFjoftHGBmdenl_ALlgj-bRYO0rTP0XAGD14YkaxgIexRxBHMgvK67QDhUZXPTDKlYWSHOnWPBOjO2Qa1xmJnexOl9gYG71vdyTwm_-HWaMRmt3muenYsT5JCfZz9JbuoYbOyVpU4klW1kqA8e3KVXgnuxxsEIu8n8yMbVIzT5cWi2bbEIy8BDU-YvG4dCLU1A2Kuqju5qnXpTuAEaWqtiAz-Ucwp8pfxm7wYvBz4LVvNkN41JBJb17e_gV4o8DmILVEKu3zfbFQOOXs6CkSpUXI_NhDQlwH4YMGa0fNpgEr91u3VDIN70Effs-2-bKcFXxes4qVed9qPPUhfspZEtBFrNOyfu793-TbNeXD9lDjwAEm8-ruX5jpzXg1mc_koSWnsJ3YHieKJfNfih7kYZyieb2KWMqV5OFsjdOFrVpYHE8hZiTMWXpQ4hrLQLIiXqKpZ3SXtKrseavDAM0NDW8fGYfOjAP8AtB8QIbFKa2xrIQio-hMJNa8aiGD8qalqTpxtvG8tcLlaxAacmHI0wzFr3wGGes9ueu-ezm8cLFPDHUfQxPU0e2G9cIuVlERlXTAwp6Lrnl5qNjHhRM0fD8RG3F2YXJ_teBmnDZNRUSTzwWbt-ErhmjyDkuv8FPFkVVjXuRk9pMw';
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(request);
  }
}
