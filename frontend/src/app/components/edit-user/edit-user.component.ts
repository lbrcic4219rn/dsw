import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../model';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id!: number;
  user: any;

  editUserForm!: FormGroup;

  readonly userService = inject(UserService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['default', [Validators.required]],
      permission: this.fb.group({
        canReadUser: [false],
        canCreateUser: [false],
        canUpdateUser: [false],
        canDeleteUser: [false]
      })
    })
    this.api.getUserById(this.id).subscribe(res => {
      this.user = res as User;

      this.editUserForm.patchValue({
        name: this.user.name,
        surname: this.user.surname,
        email: this.user.email,
        permission: {
          canReadUser: this.user.permission.canReadUser == 1 ? true : false,
          canCreateUser: this.user.permission.canCreateUser == 1 ? true : false,
          canUpdateUser: this.user.permission.canUpdateUser == 1 ? true : false,
          canDeleteUser: this.user.permission.canDeleteUser == 1 ? true : false,
        }
      })
    })
  }

  handleSubmit() {
    this.editUserForm.patchValue({
      permission: {
        canReadUser: this.editUserForm.get('permission.canReadUser')?.value == false ? 0 : 1,
        canCreateUser: this.editUserForm.get('permission.canCreateUser')?.value == false ? 0 : 1,
        canUpdateUser: this.editUserForm.get('permission.canUpdateUser')?.value == false ? 0 : 1,
        canDeleteUser: this.editUserForm.get('permission.canDeleteUser')?.value == false ? 0 : 1,
      }
    })

    if (!this.editUserForm.valid) {
      alert('Form is invalid');
      return;
    }

    this.api.editUser(this.user.id, this.editUserForm.value).subscribe({
      next: () => {
        alert('User editted successfully')
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Something went wrong')
      }
    })
  }

}
