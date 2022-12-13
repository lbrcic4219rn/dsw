import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handleLogin() {
    this.api.login(
      {
        email: this.email,
        password: this.password
      }
    ).subscribe(
      (response) => {
        console.log("hej hej")
        localStorage.setItem('jwt_token', response.token);
        this.userService.login(response.token);
        this.router.navigate(['/']);
        alert('Logged in!')
      },
      (err) => {
        if (err.status == 401)
          alert('Bad credentials');
        else
          alert('Server error');
      }
    )
  }

}
