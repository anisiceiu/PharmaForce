import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

const USER = 'user';
const JWT_TOKEN = 'jwt_t';
const USER_DETAILS = 'user_details';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  
  constructor(private _tokenService: TokenService) {}

  clearAll() {
    sessionStorage.clear();
  }

  clearAuth() {
    const token = this.JWTToken;
    this.clearAll();
    this.JWTToken = token;
  }

  public set JWTToken(token: string) {
    sessionStorage.setItem(JWT_TOKEN, token);
  }

  public get JWTToken(): string {
    if (sessionStorage.getItem(JWT_TOKEN)){
      return sessionStorage.getItem(JWT_TOKEN) || '';
    }else{
      return '';
    }
  }


  public get user() {
    const token = this.JWTToken;
    return this._tokenService.getDecodedAccessToken(token);
  }

  public set user(user) {
    sessionStorage.setItem(USER, JSON.stringify(user));
  }

  public set UserDetails(user: any) {
    sessionStorage.setItem(USER_DETAILS, JSON.stringify(user));
  }

  public get UserDetails(): any {
    if (sessionStorage.getItem(USER_DETAILS)){
      return JSON.parse(sessionStorage.getItem(USER_DETAILS) || '');
    }else{
      return '';
    }
    
  }

}
