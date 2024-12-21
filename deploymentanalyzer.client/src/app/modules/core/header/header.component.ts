import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser:any;
  constructor(private storageService:StorageService) { }

  ngOnInit() {
    this.currentUser = this.storageService.UserDetails;
  }

}
