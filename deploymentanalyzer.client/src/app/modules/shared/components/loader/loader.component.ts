import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../../../services/common/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.onLoadingChanged.subscribe(res => {
      this.isLoading = res;
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
}
