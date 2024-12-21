import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { ApiResponse } from '../../models/ApiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private _httpService: HttpService) { }

  GetAll(url: any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.get(url, showGlobalLoader);
  }

  GetAllWithParameters(url: any,data:any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.getWithParameters(url,data, showGlobalLoader);
  }

  PostAll(url: any,data:any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.post(url,data, showGlobalLoader);
  }

  GetById(url:any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.get(url, showGlobalLoader);
  }
  Create(url:any,data: any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.post(url, data, showGlobalLoader);
  }
  Update(url:any,data: any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.put(url, data, showGlobalLoader);
  }

  Delete(url:any, showGlobalLoader: boolean = true): Observable<ApiResponse> {
    return this._httpService.delete(url, showGlobalLoader);
  }


}
