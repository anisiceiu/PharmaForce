import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/ApiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  header: any;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
  }

  //  HTTP `POST`
  post(url: string, postData: any, isShowGlobalLoader: boolean, isJSONTypeAdd: boolean = false): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (isShowGlobalLoader) {
      headers = headers.set('Loader', 'true');
    }
    if (isJSONTypeAdd) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.http.post<ApiResponse>(url, postData, { headers: headers }).pipe(
      map(res => res as ApiResponse)
    );
  }

  //  HTTP `GET`
  get(url: string, isShowGlobalLoader: boolean): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (isShowGlobalLoader) {
      headers = headers.set('Loader', 'true');
    }
    return this.http.get<ApiResponse>(url, { headers: headers }).pipe(
      map(res => res as ApiResponse)
    );
  }

  getWithParameters(url: string, data: any, isShowGlobalLoader: boolean): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (isShowGlobalLoader) {
      headers = headers.set('Loader', 'true');
    }
  
    const options = {
      headers: headers,
      params: data
    };
  
    return this.http.get<ApiResponse>(url, options).pipe(
      map(res => res as ApiResponse)
    );
  }
  

  //  HTTP `PUT`
  put(url: string, putData: any, isShowGlobalLoader: boolean): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (isShowGlobalLoader) {
      headers = headers.set('Loader', 'true');
    }
    return this.http.put<ApiResponse>(url, putData, { headers: headers }).pipe(
      map(res => res as ApiResponse)
    );
  }
  

  //  HTTP `DELETE`
  delete(url: string, isShowGlobalLoader: boolean): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (isShowGlobalLoader) {
      headers = headers.set('Loader', 'true');
    }
    return this.http.delete<ApiResponse>(url, { headers: headers }).pipe(
      map(res => res as ApiResponse)
    );
  }
  

   //  HTTP `POST` for file download
   export(url: string, postData: any, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
      return this.http.post<Blob>(url, postData, { headers: headers, responseType: 'blob' as 'json' }).pipe(map(res => {
        return res;
      }));
  }
}
