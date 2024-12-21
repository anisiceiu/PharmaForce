import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/ApiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IPService {
  constructor(private http: HttpClient) {
    
  }

  public getIPAddress(callback:any)
  {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.ipify.org/?format=json");
    xhr.onload = function () {
      callback(null, xhr.response);
    };
    xhr.onerror = function () {
      callback(xhr.response);
    };

    xhr.send();
  }
}
