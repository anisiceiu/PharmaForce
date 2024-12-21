import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../services/common/storage.service';
import { AccountService } from '../../../services/account/account.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../services/common/toaster.service';
import { IPService } from '../../../services/common/ip.service';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { environment } from '../../../../environments/environment';
import { AuthenticationResult, PopupRequest } from '@azure/msal-browser';
import { LoginService } from '../../../services/account/login.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsPopupComponent } from '../../shared/terms-and-conditions-popup/terms-and-conditions-popup.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

export type LoginFormValue = {
  'email': string,
  'username': string,
  'password': string
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  currentUser: any;
  IPAddress: string = '';
  readonly dialog = inject(MatDialog);
  isAcceptTermCondition: boolean = false;
  showMessage: boolean = false;

  constructor(private fb: FormBuilder, private readonly accountService: AccountService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService, private loginService: LoginService,
    private msalBroadcastService: MsalBroadcastService,
    private readonly storageService: StorageService, private readonly router: Router, private ipService: IPService,
    private toasterService: ToasterService) {
      
    this.currentUser = this.storageService.UserDetails;
    if(this.currentUser){
      if(this.currentUser.id > 0){
        this.router.navigate(['dashboard'], { replaceUrl: true });
      }
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  onTCCheckChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.showMessage = false;
    }
    else {
      this.showMessage = true;
    }

    this.isAcceptTermCondition = event.checked;
  }

  openTermsConditionDialog() {
    const dialogRef = this.dialog.open(TermsAndConditionsPopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  onSubmit() {
    this.showMessage = false;

    if (this.loginForm.invalid) {
      return;
    }

    if (!this.isAcceptTermCondition) {
      this.showMessage = true;
      return;
    }

    const { email, username, password } = this.loginForm.value as (LoginFormValue);

    (this.accountService.checkUser({
      EmailAddress: email,
      userName: username,
      Password: password,
      isAdmin: false,
      IPAddress: this.IPAddress
    })).subscribe({
      next: (res: any) => {
        if (res && res.status) {
          this.storageService.clearAll();
          let result = res.result;
          this.accountService.setCurrentClient(result);
          if (result.isReVerificationNeeded) {
            this.router.navigateByUrl('/verify-otp');
          }
          else {
            if (environment.b2clogin) {
              this.proceedToClientLogin(result);
            }
            else {
              this.storageService.JWTToken = result.token;
              this.storageService.UserDetails = result.user;
              this.loginService.setUserLoggedIn(true);
              this.router.navigate(['/dashboard']);
              
            }
          }
          
          //this.router.navigateByUrl('/verify-otp');
          //if (environment.b2clogin) {
          //  this.proceedToClientLogin(result);
          //}
          //else {
          //  this.router.navigate(['/dashboard']);
          //  this.loginService.setUserLoggedIn(true);
          //}
        } else {
          if (res.message == 'Invalid Company username or password.') {
            if (this.accountService.getClientTryCount() < 3)
              this.accountService.IncrementClientTryCount();
            else
            {
              this.LockClientAccount(email);
            }
          }
          this.toasterService.showError(res.message);
        }
      },
      error: (err: any) => {
        this.toasterService.showError("Incorrect username or password")
      },
      complete: () => {
      }
    });

  }

  LockClientAccount(email:string) {
    let data: any = { ClientEmailId: email, LockStatus: true, LockUnlockTime: new Date() }
    this.accountService.lockClientAccount(data).subscribe(data => {
      if (data && data.status) {
        this.toasterService.showWarning('Your account is locked for next 24 hours due to 3 consecutive failed attempts.');
      }
      
    });
  }

  proceedToClientLogin(result:any) {

    
    let data = {
      ClientId: result.clientId,
      CompanyUserId: result.companyUserId,
      EmailAddress: result.emailAddress,
      CompanyCode: result.companyCode,
      OTP: "00000",
      IsB2CEnabled: environment.b2clogin
    }

    this.accountService.proceedClientLogin(data).subscribe((response: any) => {

      if (response) {

        this.storageService.clearAll();
        let result = response.result;

        if (result && response.status) {

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
    },
      (err: any) => {
      }
    );

  }
}
