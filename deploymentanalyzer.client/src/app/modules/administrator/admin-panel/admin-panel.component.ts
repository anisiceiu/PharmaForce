import { Component, Input } from '@angular/core';
import { StorageService } from '../../../services/common/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  
  @Input() isToggleMenu = false;
  year = new Date().getFullYear();
  constructor(private storageService:StorageService,private router:Router) { }

  ngOnInit(): void {
    
  }

  changeRoute(routeValue:string){
    this.router.navigate([routeValue]);
    setTimeout(() => {
      this.initializeMenu();
    }, 100);
  }

  ngAfterViewInit(){
    this.initializeMenu();
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

  logout(){
    this.storageService.clearAll();
    this.router.navigate(['login']);
  }
}
