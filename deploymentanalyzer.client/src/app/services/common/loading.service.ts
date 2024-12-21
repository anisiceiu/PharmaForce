import { Injectable, EventEmitter } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  onLoadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private requests: HttpRequest<any>[] = [];

  onStarted(req: HttpRequest<any>): void {
    this.requests.push(req);
    this.notify();
  }

  onFinished(req: HttpRequest<any>): void {
    const index = this.requests.indexOf(req);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
    this.notify();
  }

  private notify(): void {
    this.onLoadingChanged.emit(this.requests.length !== 0);
  }

  showLoader ():void{
    this.onLoadingChanged.emit(this.requests.length !== 0);
  }
}
