import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from '../../../services/common/storage.service';
import { AUTH_HEADER } from '../../../constants/route.constant';
import { rootPath } from '../../../constants/api.constant';
import { AccountService } from '../../../services/account/account.service';
import { CommonMethodService } from '../../../services/common/common-method.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private readonly _storageService: StorageService,
    private readonly _router: Router,
    private readonly _commonService: CommonMethodService,
    private readonly _accountService: AccountService
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._commonService.setTitle(this._router.url.replace('/',''));
     
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes('/api/account/login') || request.url.toLowerCase().includes('/api/account/adminlogin') || request.url.toLowerCase().includes('/api/account/checkuser') || request.url.toLowerCase().includes('/api/account/proceedclientlogin') || request.url.toLowerCase().includes('/api/account/verifyotp') || request.url.toLowerCase().includes('/api/account/lockclientaccount')) {
      return next.handle(request);
    }

    let authReq = request;

    if (!this._accountService.isTokenValid) {
      return this.handleTokenRefresh(authReq, next);
    } else {
      authReq = this.addTokenHeader(request, this._storageService.JWTToken);
      return next.handle(authReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleTokenRefresh(authReq, next);
          }
          return throwError(error);
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { [AUTH_HEADER]: `Bearer ${token}` }
    });
  }

  private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this._accountService.getRefreshToken().pipe(
        switchMap((configData: any) => {
          this.isRefreshing = false;
          this._storageService.JWTToken = configData.result;
          this.refreshTokenSubject.next(configData.result);
          return next.handle(this.addTokenHeader(request, configData.result));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this._storageService.clearAll();
          this._router.navigate(['login']);
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwtToken => next.handle(this.addTokenHeader(request, jwtToken)))
      );
    }
  }
}
