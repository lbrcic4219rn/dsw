import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {UserService} from '../../services/user.service';
import {ApiService} from '../../services/api.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-create-machine',
  imports: [FormsModule],
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css']
})
export class CreateMachineComponent {

  machineName = '';

  readonly submitting = signal(false);

  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);
  readonly userService = inject(UserService);

  createMachine(): void {
    const name = this.machineName.trim();
    if (name.length === 0) {
      this.notifications.error('Machine name is required.');
      return;
    }

    this.submitting.set(true);
    this.api.createMachine(name).subscribe({
      next: () => {
        this.submitting.set(false);
        this.machineName = '';
        this.notifications.success(`Machine "${name}" created.`);
      },
      error: () => this.submitting.set(false)
    });
  }
}
