import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {UserService} from '../../services/user.service';
import {ApiService} from '../../services/api.service';
import {NotificationService} from '../../services/notification.service';
import {User, UserPayload} from '../../model';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly userService = inject(UserService);

  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    permission: this.fb.nonNullable.group({
      canReadUser: [false],
      canCreateUser: [false],
      canUpdateUser: [false],
      canDeleteUser: [false]
    })
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.notifications.error('Invalid user id.');
      void this.router.navigate(['/']);
      return;
    }

    this.loading.set(true);
    this.api.getUserById(id).subscribe({
      next: user => {
        this.user.set(user);
        this.form.patchValue({
          name: user.name,
          surname: user.surname,
          email: user.email,
          permission: {
            canReadUser: user.permission.canReadUser === 1,
            canCreateUser: user.permission.canCreateUser === 1,
            canUpdateUser: user.permission.canUpdateUser === 1,
            canDeleteUser: user.permission.canDeleteUser === 1
          }
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  showError(control: 'name' | 'surname' | 'email'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.dirty || field.touched);
  }

  handleSubmit(): void {
    const current = this.user();
    if (!current) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notifications.error('Please correct the highlighted fields.');
      return;
    }

    this.submitting.set(true);
    this.api.editUser(current.id, this.toPayload(current)).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notifications.success('User updated.');
        void this.router.navigate(['/']);
      },
      error: () => this.submitting.set(false)
    });
  }

  private toPayload(current: User): UserPayload {
    const {name, surname, email, permission} = this.form.getRawValue();
    return {
      name,
      surname,
      email,
      password: 'default',
      permission: {
        canReadUser: permission.canReadUser ? 1 : 0,
        canCreateUser: permission.canCreateUser ? 1 : 0,
        canUpdateUser: permission.canUpdateUser ? 1 : 0,
        canDeleteUser: permission.canDeleteUser ? 1 : 0,
        canSearchMachine: current.permission.canSearchMachine,
        canStartMachine: current.permission.canStartMachine,
        canStopMachine: current.permission.canStopMachine,
        canRestartMachine: current.permission.canRestartMachine,
        canCreateMachine: current.permission.canCreateMachine,
        canDestroyMachine: current.permission.canDestroyMachine
      }
    };
  }
}
