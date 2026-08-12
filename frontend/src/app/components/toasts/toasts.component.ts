import {Component, inject} from '@angular/core';

import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css']
})
export class ToastsComponent {
  readonly notifications = inject(NotificationService);

  cssClass(kind: string): string {
    switch (kind) {
      case 'success':
        return 'text-bg-success';
      case 'error':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }
}
