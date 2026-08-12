import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import {UserService} from '../../services/user.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  readonly submitting = signal(false);

  private readonly userService = inject(UserService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  handleLogin(): void {
    if (this.submitting()) {
      return;
    }
    if (!this.email.trim() || !this.password) {
      this.notifications.error('Enter both an email and a password.');
      return;
    }

    this.submitting.set(true);
    this.userService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.submitting.set(false);
        if (!this.userService.hasAnyPermission()) {
          this.notifications.error('This account has no permissions.');
          this.userService.logout();
          return;
        }
        this.notifications.success('Signed in.');
        void this.router.navigate(['/']);
      },
      error: err => {
        this.submitting.set(false);
        this.notifications.error(
          err.status === 401 ? 'Bad credentials.' : 'Could not sign in. Please try again.'
        );
      }
    });
  }

}
