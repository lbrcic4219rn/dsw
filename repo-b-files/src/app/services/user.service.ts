import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Permissions} from "../model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _loggedIn: boolean = false;
  private _permissions!: Permissions;
  private _jwtToken: string = '';

  constructor(
    private router: Router
  ) { }

  get loggedIn(): boolean {
    return this._loggedIn;
  }

  get permissions(): Permissions {
    return this._permissions;
  }

  set jwtToken(token: string) {
    this._jwtToken = token;
  }

  setPermissions(token: string) {
    const perms = JSON.parse(atob(token.split('.')[1])).permissions;
    this._permissions = perms;
  }

  login(token: string) {
    this.jwtToken = token;
    this.setPermissions(token);
    if (
      this.permissions.canReadUser == 0 &&
      this.permissions.canDeleteUser == 0 &&
      this.permissions.canUpdateUser == 0 &&
      this.permissions.canCreateUser == 0 &&
      this.permissions.canSearchMachine == 0 &&
      this.permissions.canStartMachine == 0 &&
      this.permissions.canStopMachine == 0 &&
      this.permissions.canRestartMachine == 0 &&
      this.permissions.canCreateMachine == 0 &&
      this.permissions.canDestroyMachine == 0
    ) {
      alert('User has no permissions, logging out');
      this.logout();
    }
  }

  checkJWTToken(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.setPermissions(token);
      this._loggedIn = true;
      return true;
    }
    return false;
  }

  logout() {
    this._loggedIn = false;
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
