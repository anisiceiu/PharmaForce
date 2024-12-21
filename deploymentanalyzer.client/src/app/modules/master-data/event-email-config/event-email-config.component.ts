import { Component } from '@angular/core';
import { EventEmailConfig } from '../../../models/eventEmailConfig';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { StorageService } from '../../../services/common/storage.service';
import { ApiResponse } from '../../../models/ApiResponse';
import { GetAllEventEmailConfig, UpdateEventEmailConfig } from '../../../constants/api.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-email-config',
  templateUrl: './event-email-config.component.html',
  styleUrl: './event-email-config.component.scss'
})
export class EventEmailConfigComponent {
  eventConfigs: EventEmailConfig[] = [];
  selectedEventConfig: EventEmailConfig | null = null;
  currentUser: any;
  subscribers: Array<string> = new Array<string>();
  clientForm: FormGroup;
  constructor(private apiService: ApiService, private toasterService: ToasterService, private _storageService: StorageService, public fb: FormBuilder,) {
    this.clientForm = this.fb.group({
      emailID: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this._storageService.UserDetails;
    this.loadEventEmailConfigs();
  }

  removeItem(item: string) {
    let index: number = this.subscribers.findIndex(c => c == item);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  addItem() {
    let newEmail = this.clientForm.controls['emailID'].value;
    if (newEmail) {
      if (this.subscribers.findIndex(c => c == newEmail) == -1) {
        this.subscribers.push(this.clientForm.controls['emailID'].value);
        this.clientForm.controls['emailID'].setValue(null);
      }
    }
  }

  loadEventEmailConfigs() {
    this.apiService.PostAll(GetAllEventEmailConfig, { user_id: this.currentUser.id }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.eventConfigs = response.result;
        if (this.eventConfigs && this.eventConfigs.length) {

          if (!this.selectedEventConfig || !this.selectedEventConfig.id) {
            this.selectedEventConfig = this.eventConfigs[0];
            if (this.selectedEventConfig.event_subscribers)
            this.subscribers = this.selectedEventConfig.event_subscribers.split(',');
          }
          
        }
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  onSelectedEventConfigChange(data: EventEmailConfig) {
    if (data) {
      this.selectedEventConfig = data;
      if(data.event_subscribers)
        this.subscribers = data.event_subscribers.split(',');
    }

    console.log(data);
  }

  saveEventConfig() {

    if (this.selectedEventConfig) {
      let data: EventEmailConfig = {
        ...this.selectedEventConfig,
        modified_by: this.currentUser.id,
        modified_date: new Date(),
        event_subscribers: this.subscribers.join(',')
      };

      this.apiService.PostAll(UpdateEventEmailConfig, data).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.loadEventEmailConfigs();
          this.toasterService.showSuccess(response.message);
        } else {
          this.toasterService.showError(response.message);
        }
      });

    }
  }
}
