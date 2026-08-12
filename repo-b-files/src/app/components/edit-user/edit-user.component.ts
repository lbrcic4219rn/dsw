import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id!: number;
  user: any;

  editUserForm!: FormGroup;

  constructor(
    public userService: UserService,
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

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
      console.log(this.user);

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

    this.api.editUser(this.user.id, this.editUserForm.value).subscribe(
      res => {
        alert('User editted successfully')
        this.router.navigate(['/']);
      }, err => {
        alert('Something went wrong')
      }
    )
  }

}
