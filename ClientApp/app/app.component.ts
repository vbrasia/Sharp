import { Component, NgZone } from '@angular/core';
import { ErrorHandlerService } from './errorHandler.service';
import { Repository } from './models/repository';
import { ResizedEvent } from 'angular-resize-event/resized-event';

const storesUrl = '/api/stores';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private lastError: string[];
  constructor(private repo: Repository, errorHandler: ErrorHandlerService, ngZone: NgZone) {
    errorHandler.errors.subscribe(error => {
      ngZone.run(() => this.lastError = error);
      });
  }

  title = 'SHARP';
  clearError() {
    this.repo.apiBusy = false;
    this.lastError = null;
  }
  get error(): string[] {
    return this.lastError;
  }
  onResized(event: ResizedEvent): void {
    this.repo.screenWidth = event.newWidth;
  }

  get apiBusy() {
    return this.repo.apiBusy;
  }

}
