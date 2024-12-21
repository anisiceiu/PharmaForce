import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {  Observable, Subject } from 'rxjs';
const commonTitle = 'Deployment Analyzer';

@Injectable()
export class CommonMethodService {

  title = new Subject<string>();
  constructor(private _titleService: Title) {
  }
 
  setTitle(title: string) {
    if (title !== undefined) {
      this.title.next(title);
      this._titleService.setTitle(`${title} - ${commonTitle}`);
    }
  }

  getTitle(): Observable<any> {
    return this.title.asObservable();
  }

  clearTitle() {
    this.title.next('');
  }

  
}
