import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../../../services/common/storage.service';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { MatDialog } from '@angular/material/dialog';
import { UserPermissionModel } from '../../../models/AppFunction';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() isToggleMenu = false;
  currentUser: any;
  year = new Date().getFullYear();
  adminFunctionList = "";
  userPermission: UserPermissionModel = {
    canAccessReport: true,
    canExportExcel: true,
    canSaveSearch: true
  } as UserPermissionModel;

  FN_Citations = "46";
  FN_Data_Manager = "42";
  FN_Manage_QC_Queue = "45";
  FN_Master_Codes = "44";
  FN_Notes = "47";
  FN_User_Login_Detail = "51";
  FN_Manage_Admin_Access_Rights = "39";
  FN_Manage_Admin_Accounts = "38";
  FN_Review_Admin_Activity_Log = "40";
  FN_SQL_Data_Management = "41";
  FN_Email_Suffix_Management = "49";
  FN_Manage_Client_Access = "50";
  FN_Manage_User_Accounts = "48";
  FN_KeyUpdates = "52";
  FN_News = "28";
  FN_CompanyUpdates = "53";
  FN_ExportExcel = "54";
  FN_SaveSearch = "55";

  CanAccess_KeyUpdates = false;
  CanAccess_News = false;

  constructor(private storageService: StorageService, private router: Router, private authService: MsalService, private dialogRef: MatDialog,) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.adminFunctionList = this.currentUser.adminFunctions.split(",");
    this.setUserPermission();
  }

  setUserPermission() {
    if (this.storageService.UserDetails && this.storageService.UserDetails.userType == 'U' && this.storageService.UserDetails.userRights) {
      this.userPermission.canAccessReport = this.storageService.UserDetails.userRights.reportAccess;
      this.userPermission.canExportExcel = this.storageService.UserDetails.userRights.excelDownloadRights;
      this.userPermission.canSaveSearch = this.storageService.UserDetails.userRights.saveSearchAccess;
      this.CanAccess_KeyUpdates = true;
      this.CanAccess_News = true;
    }
    else {
      if (this.storageService.UserDetails.userType != 'U') {
        if (this.checkMenuAccess(this.FN_ExportExcel)) {
          this.userPermission.canExportExcel = true;
        }
        else {
          this.userPermission.canExportExcel = false;
        }

        if (this.checkMenuAccess(this.FN_SaveSearch)) {
          this.userPermission.canSaveSearch = true;
        }
        else {
          this.userPermission.canSaveSearch = false;
        }
      }

      this.CanAccess_KeyUpdates = false;
      this.CanAccess_News = false;
    }
  }

  changeRoute(routeValue:string){
    this.router.navigate([routeValue]);
    setTimeout(() => {
      this.initializeMenu();
    }, 100);
  }

  ngAfterViewInit(){
    this.initializeMenu();
    const menuItems = document.querySelectorAll('.main-menu-item');

    menuItems.forEach(item => {
      item.addEventListener('click', (event) => {
        if (event.target && (event.target as HTMLElement).closest('.main-menu-link')) {
          // Toggle 'showMenu' class
          if (item.classList.contains('showMenu')) {
            item.classList.remove('showMenu');
          } else {
            item.classList.add('showMenu');
          }
        }
      });
    });

    // Handle sub-main menu items
    const subMenuItems = document.querySelectorAll('.sub-main-menu-item');

    subMenuItems.forEach(subItem => {
      subItem.addEventListener('click', (event) => {
        if (event.target && (event.target as HTMLElement).closest('.sub-main-menu-link')) {
          // Toggle 'showMenu' class
          if (subItem.classList.contains('showMenu')) {
            subItem.classList.remove('showMenu');
          } else {
            subItem.classList.add('showMenu');
          }
        }
        event.stopPropagation(); // Prevent click event from bubbling up to main menu items
      });
    });
  }
  
  initializeMenu(): void {
    const arrows = document.querySelectorAll(".link_icon_arrow");
    arrows.forEach(arrow => {
      arrow.addEventListener("click", (e) => {
        const arrowParent = (e.target as HTMLElement).parentElement?.parentElement;
        if (arrowParent) {
          arrowParent.classList.toggle("showMenu");
        }
      });
    });
  }

  toggleSidebar() {
    if (this.isToggleMenu) {
      this.isToggleMenu = false;
    } else {
      this.isToggleMenu = true;
    }
    let sidebar = document.querySelector('.main-sidebar-menu');
    sidebar?.classList.toggle('collapsed');
  }

  logout() {
    this.dialogRef.closeAll();
    let currentUser = this.storageService.UserDetails;
    this.storageService.clearAll();
    let origin = window.location.origin;
    if (origin.includes('localhost')) {
      //logout for b2c
      if (currentUser?.userType == 'SA' || currentUser?.userType == 'A') {
        this.router.navigate(['/admin-login']);
      }
      else {
        //this.router.navigate(['/login']);
        this.authService.logoutRedirect({

          postLogoutRedirectUri: origin + '/login'
        });
      }
      
    } else {

      if (currentUser?.userType == 'SA' || currentUser?.userType == 'A') {
        
        this.authService.logoutRedirect({

          postLogoutRedirectUri: origin + '/admin-login'
        });
      }
      else {
        this.authService.logoutRedirect({

          postLogoutRedirectUri: origin + '/login'
        });
      }
      
    }
  }

  checkMenuAccess(functionId: string) { 
    if (this.adminFunctionList.includes(functionId)) {
      return true
    } 
    else {
      return false
    }
  }
}
