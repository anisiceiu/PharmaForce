import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account/account.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LoginService } from '../../../services/account/login.service';
import { environment } from '../../../../environments/environment';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { PopupRequest, AuthenticationResult, RedirectRequest } from '@azure/msal-browser';
import { ClientLoginFirstStepResult } from '../../../models/logInResult';

@Component({
  selector: 'app-verfy-otp',
  templateUrl: './verfy-otp.component.html',
  styleUrl: './verfy-otp.component.css'
})
export class VerfyOtpComponent {
  loginForm: FormGroup;
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private fb: FormBuilder, private readonly accountService: AccountService, private loginService: LoginService,
    private readonly storageService: StorageService, private readonly router: Router, private readonly toastrService: ToasterService) {
    this.loginForm = this.fb.group({
      otp: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  
  }


  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    let currentClient: ClientLoginFirstStepResult | null = this.accountService.getCurrentClient();

    let data = {
      ClientId: currentClient?.clientId,
      CompanyUserId: currentClient?.companyUserId,
      EmailAddress: currentClient?.emailAddress,
      CompanyCode: currentClient?.companyCode,
      OTP: this.loginForm.controls['otp'].value,
      IsB2CEnabled: environment.b2clogin
    }

    this.accountService.verifyOTP(data).subscribe((response: any) => {

      if (response) {

        this.storageService.clearAll();
        let result = response.result;

        if (result && response.status) {
         
          if(environment.b2clogin){

            
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
          this.toastrService.showError("Either your OTP is invalid or expired.");
        }
        
      }
    },
      (err: any) => {
      }
    );

  }
}
