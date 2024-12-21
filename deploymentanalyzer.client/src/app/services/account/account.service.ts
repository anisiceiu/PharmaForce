import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../common/storage.service';
import { HttpService } from '../common/http.service';
import { checkUser, verifyOTP, adminLogin, login, refreshToken, proceedClientLogin, lockClientAccount } from '../../constants/api.constant';
import { ClientLoginFirstStepResult } from '../../models/logInResult';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private validToken = new BehaviorSubject<boolean>(false);
  $validToken = this.validToken.asObservable();
  private clientTryCount: number = 0;
  private currentClient: ClientLoginFirstStepResult | null = null;
  private isAccountSwitched: boolean = false;
  constructor(private _httpService: HttpService, private _storageService: StorageService) { }

  switchAccount(switchtoUser: any) {
    this._storageService.UserDetails = switchtoUser;
    this.isAccountSwitched = true;
  }

  setIsAccountSwitched(flag: boolean) {
    this.isAccountSwitched = flag;
  }

  getIsAccountSwitched()
  {
    return this.isAccountSwitched;
  }

  IncrementClientTryCount() {
    this.clientTryCount += 1;
  }

  getClientTryCount() {
    return this.clientTryCount;
  }

  setCurrentClient(client: ClientLoginFirstStepResult) {
    this.currentClient = client;
  }

  getCurrentClient() {
    return this.currentClient;
  }

  getValidToken(val: any) {
    
    this.validToken.next(val);
  }
  get isLoggedIn() {
    return !!this._storageService.user;
  }

  get isTokenValid() {
    return !!this._storageService.JWTToken;
  }

  login(loginModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(login, loginModel, showGlobalLoader);
  }

  checkUser(loginModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(checkUser, loginModel, showGlobalLoader);
  }

  verifyOTP(otpVerify: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(verifyOTP, otpVerify, showGlobalLoader);
  }

  proceedClientLogin(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(proceedClientLogin, data, showGlobalLoader);
  }

  lockClientAccount(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(lockClientAccount, data, showGlobalLoader);
  }

  adminLogin(loginModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(adminLogin, loginModel, showGlobalLoader);
  }

  getRefreshToken() {
    return this._httpService.post(refreshToken, {},false);
  }

  logout() {
    this._storageService.clearAll();
  }
}
