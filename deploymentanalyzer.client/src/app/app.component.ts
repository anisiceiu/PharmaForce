import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AccountService } from './services/account/account.service';
import { LoginService } from './services/account/login.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './services/common/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date | null = null;
  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router, private accountService: AccountService, private loginService: LoginService, private dialogRef: MatDialog, private storageService: StorageService) {

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(1800);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(15);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
      //this.router.navigate(['/login']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'The session will time out in ' + countdown + ' seconds!'
      
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.loginService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })

    if (accountService.isLoggedIn) {
      this.loginService.setUserLoggedIn(true);
    }

  }


  stay() {
    this.reset();
  }

  logout() {
    this.dialogRef.closeAll();
    let currentUser = this.storageService.UserDetails;
    this.accountService.logout();
    this.loginService.setUserLoggedIn(false);
    if (currentUser?.userType == 'SA' || currentUser?.userType == 'A') {
      this.router.navigate(['/admin-login']);
    }
    else {
      this.router.navigate(['/login']);
    }
    
  }


  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  ngOnInit() {
   
  }
  
  title = 'Deployment Analyzer';
}
