import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  newUserForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  readonly userService = inject(UserService);

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      permission: this.fb.group({
        canReadUser: [false],
        canCreateUser: [false],
        canUpdateUser: [false],
        canDeleteUser: [false]
      })
    })
  }

  get form() {
    return this.newUserForm;
  }

  handleSubmit() {
    this.newUserForm.patchValue({
      permission: {
        canReadUser: this.form.get('permission.canReadUser')?.value == false ? 0 : 1,
        canCreateUser: this.form.get('permission.canCreateUser')?.value == false ? 0 : 1,
        canUpdateUser: this.form.get('permission.canUpdateUser')?.value == false ? 0 : 1,
        canDeleteUser: this.form.get('permission.canDeleteUser')?.value == false ? 0 : 1,
      }
    })
    if (!this.newUserForm.valid) {
      alert('Form is invalid');
      return;
    }
    this.api.createNewUser(this.newUserForm.value).subscribe({
      next: () => {
        this.newUserForm.reset()
        alert('User created successfully');
      },
      error: err => {
        if (err.status == 400) {
          alert('User with that email already exists')
        } else {
          alert('Server error')
        }
      }
    })
  }

}
