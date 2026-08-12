import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from '../../model';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly api = inject(ApiService);
  private readonly userService = inject(UserService);

  userList: User[] = []
  hasPermission: boolean = true;

  canUpdate: number = this.userService.permissions.canUpdateUser
  canDelete: number = this.userService.permissions.canDeleteUser

  ngOnInit(): void {
    if (this.userService.permissions.canReadUser == 1) {
      this.getAllUsers();
    } else {
      this.hasPermission = false;
    }
  }

  getAllUsers() {
    this.api.getAllUsers().subscribe(
      response => {
        this.userList = response
      }
    )
  }

  handleDelete(id: number) {
    this.api.deleteUser(id).subscribe({
      next: () => {
        alert('User deleted')
        this.getAllUsers();
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
