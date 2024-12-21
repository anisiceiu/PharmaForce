import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/common/storage.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { AccountService } from '../../../services/account/account.service';
import { ApiResponse } from '../../../models/ApiResponse';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, map, tap, filter, take } from 'rxjs/operators';
import { ToasterService } from '../../../services/common/toaster.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const commonMethod = inject(CommonMethodService);
  const accountService = inject(AccountService);
  const toasterService = inject(ToasterService);

  const token = storageService.JWTToken;

  if (token) {
    const user = storageService.user;
    if(user){
      const tokenExpiry = new Date(user.exp * 1000);
      const today = new Date();

      if (tokenExpiry < today) {
        return handleTokenRefresh(accountService, storageService, commonMethod, router).pipe(
          map((isValid) => {
            if (isValid) {
              return true;
            } else {
              commonMethod.setTitle('Login');
              storageService.clearAll();
              router.navigate(['login'], { replaceUrl: true });
              return false;
            }
          }),
          catchError(() => {
            commonMethod.setTitle('Login');
            storageService.clearAll();
            router.navigate(['login'], { replaceUrl: true });
            return of(false);
          })
        );
      } else {
        return of(true);
      }
    }else{
      toasterService.showError("Invalid credentials");
      return of(false);
    }
  } else {
    commonMethod.setTitle('Login');
    router.navigate(['login'], { replaceUrl: true });
    return of(false);
  }
};

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

function handleTokenRefresh(
  accountService: AccountService,
  storageService: StorageService,
  commonMethod: CommonMethodService,
  router: Router
): Observable<boolean> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return accountService.getRefreshToken().pipe(
      map((response: ApiResponse) => {
        if (response.status) {
          storageService.JWTToken = response.result;
          refreshTokenSubject.next(true);
          return true;
        } else {
          const userDetails = JSON.parse(sessionStorage.getItem('user_details') || '{}');
          const userType = userDetails.userType ? userDetails.userType.toLowerCase() : null;
          if (userType && (userType === 'sa' || userType === 'a')) {
            commonMethod.setTitle('Login');
            storageService.clearAll();
            router.navigate(['admin-login'], { replaceUrl: true });
          } else {
            commonMethod.setTitle('Login');
            storageService.clearAll();
            router.navigate(['login'], { replaceUrl: true });
          }
          refreshTokenSubject.next(false);
          return false;
        }
      }),
      catchError(() => {
        commonMethod.setTitle('Login');
        storageService.clearAll();
        router.navigate(['login'], { replaceUrl: true });
        refreshTokenSubject.next(false);
        return of(false);
      }),
      tap(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((status) => status !== null),
      take(1),
      switchMap((status) => of(status as boolean))
    );
  }
}
