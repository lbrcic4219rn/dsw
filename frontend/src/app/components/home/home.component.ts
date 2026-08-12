import {Component, OnInit, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

import {User} from '../../model';
import {ApiService} from '../../services/api.service';
import {UserService} from '../../services/user.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);
  readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly deletingId = signal<number | null>(null);

  ngOnInit(): void {
    if (this.userService.can('canReadUser')) {
      this.getAllUsers();
    }
  }

  getAllUsers(): void {
    this.loading.set(true);
    this.api.getAllUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  handleDelete(user: User): void {
    if (!confirm(`Delete ${user.name} ${user.surname} (${user.email})?`)) {
      return;
    }

    this.deletingId.set(user.id);
    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.notifications.success('User deleted.');
        this.getAllUsers();
      },
      error: () => this.deletingId.set(null)
    });
  }

}
