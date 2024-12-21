import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../services/common/storage.service';
import { AccountService } from '../../../services/account/account.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../services/common/toaster.service';
import { LoginService } from '../../../services/account/login.service';
import { IPService } from '../../../services/common/ip.service';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, PopupRequest } from '@azure/msal-browser';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TermsAndConditionsPopupComponent } from '../../shared/terms-and-conditions-popup/terms-and-conditions-popup.component';

export type LoginFormValue = { 
  'username': string,
  'password': string
};

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  IPAddress: string = '';
  
  constructor(private fb: FormBuilder, private readonly accountService: AccountService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService, private loginService: LoginService,
    private msalBroadcastService: MsalBroadcastService,
    private readonly storageService: StorageService, private readonly router: Router, private ipService: IPService,
    private toasterService: ToasterService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      keepSignIn: [false]
    });

    this.getClientIpAddress();
  }

  ngOnInit() {

  }


  getClientIpAddress() {
    this.ipService.getIPAddress((err: any, data: any) => {
      if (data) {
        let result = JSON.parse(data);
        this.IPAddress = result?.ip;
      }
    });
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value as (LoginFormValue);

    this.accountService.adminLogin(
      { userName: username, password: password, isAdmin: true, ipAddress: this.IPAddress, IsB2CEnabled: environment.b2clogin })
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.storageService.clearAll();
            let result = response.result;
            this.storageService.JWTToken = result.token;
            this.storageService.UserDetails = result.user;
            
            if (environment.b2clogin) {
              this.proceedToAADLogin(response);
            }
            else {
              let result = response.result;
              this.storageService.JWTToken = result.token;
              this.storageService.UserDetails = result.user;
              this.loginService.setUserLoggedIn(true);
              this.router.navigate(['/dashboard']);
            }

          }else{
            this.toasterService.showError(response.message);
          }
        },
        error: (err: any) => {
          this.toasterService.showError("Incorrect username or password");
        },
        complete: () => {
        }
      });
  }

  proceedToAADLogin(response:any) {

   this.storageService.clearAll();
    if (response && response.status) {
      let result = response.result;
      if (environment.b2clogin) {
        // open popup for azure b2c
        if (this.msalGuardConfig.authRequest) {
          this.authService
            .loginPopup({ ...this.msalGuardConfig.authRequest, loginHint: result.user.email } as PopupRequest)
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
              this.storageService.JWTToken = result.token;
              this.storageService.UserDetails = result.user;
              this.loginService.setUserLoggedIn(true);
              this.router.navigate(['/dashboard']);
            });
        } else {
          this.authService
            .loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
              this.storageService.JWTToken = result.token;
              this.storageService.UserDetails = result.user;
              this.loginService.setUserLoggedIn(true);
              this.router.navigate(['/dashboard']);
            });
        }

      } else {
        this.storageService.JWTToken = result.token;
        this.storageService.UserDetails = result.user;
        this.loginService.setUserLoggedIn(true);
        this.router.navigate(['/dashboard']);
      }
    }
    else {
      this.toasterService.showError(response.message);
    }
 }

  onFocus(event: any) {
    event.target.nextElementSibling.classList.add('filled');
  }
  
  onBlur(event: any) {
    if (!event.target.value) {
      event.target.nextElementSibling.classList.remove('filled');
    }
  }
  
}
