import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  private readonly api = inject(ApiService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  handleLogin() {
    this.api.login(
      {
        email: this.email,
        password: this.password
      }
    ).subscribe({
      next: (response) => {
        localStorage.setItem('jwt_token', response.token);
        this.userService.login(response.token);
        this.router.navigate(['/']);
        alert('Logged in!')
      },
      error: (err) => {
        if (err.status == 401)
          alert('Bad credentials');
        else
          alert('Server error');
      }
    })
  }

}
