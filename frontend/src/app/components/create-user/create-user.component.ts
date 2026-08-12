import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {ApiService} from '../../services/api.service';
import {UserService} from '../../services/user.service';
import {NotificationService} from '../../services/notification.service';
import {UserPayload} from '../../model';

@Component({
  selector: 'app-create-user',
  imports: [ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);
  readonly userService = inject(UserService);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    permission: this.fb.nonNullable.group({
      canReadUser: [false],
      canCreateUser: [false],
      canUpdateUser: [false],
      canDeleteUser: [false]
    })
  });

  showError(control: 'name' | 'surname' | 'email' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.dirty || field.touched);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notifications.error('Please correct the highlighted fields.');
      return;
    }

    this.submitting.set(true);
    this.api.createNewUser(this.toPayload()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset();
        this.notifications.success('User created.');
      },
      error: () => this.submitting.set(false)
    });
  }

  private toPayload(): UserPayload {
    const {name, surname, email, password, permission} = this.form.getRawValue();
    return {
      name,
      surname,
      email,
      password,
      permission: {
        canReadUser: permission.canReadUser ? 1 : 0,
        canCreateUser: permission.canCreateUser ? 1 : 0,
        canUpdateUser: permission.canUpdateUser ? 1 : 0,
        canDeleteUser: permission.canDeleteUser ? 1 : 0,
        canSearchMachine: 0,
        canStartMachine: 0,
        canStopMachine: 0,
        canRestartMachine: 0,
        canCreateMachine: 0,
        canDestroyMachine: 0
      }
    };
  }
}
