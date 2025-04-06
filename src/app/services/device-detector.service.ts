import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService implements OnDestroy {
  viewportWidth: number = 0;
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;
  resizeSubscription: Subscription;

  constructor() {
    this.updateViewportWidth();
    this.updateDeviceType();

    this.resizeSubscription = fromEvent(window, 'resize').pipe(
      debounceTime(100)
    ).subscribe(() => {
      this.updateViewportWidth();
      this.updateDeviceType();
    });
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  updateViewportWidth() {
    this.viewportWidth = window.innerWidth;
  }

  updateDeviceType() {
    this.isMobile = this.viewportWidth < 768;
    this.isTablet = this.viewportWidth >= 768 && this.viewportWidth < 1024;
    this.isDesktop = this.viewportWidth >= 1024;
  }
}
