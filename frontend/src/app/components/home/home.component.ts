import { Component, OnInit } from '@angular/core';
import {User} from "../../model";
import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userList: User[] = []
  hasPermission: boolean = true;

  canUpdate: number = this.userService.permissions.canUpdateUser
  canDelete: number = this.userService.permissions.canDeleteUser

  constructor(
    private api: ApiService,
    private userService: UserService,
  ) { }

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
    this.api.deleteUser(id).subscribe(
      res => {
        alert('User deleted')
        this.getAllUsers();
      }, err => {
        console.log(err);
      }
    )
  }

}
