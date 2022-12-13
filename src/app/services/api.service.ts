import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest, User} from "../model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(formData: LoginRequest) {
    return this.http.post<any>(`${environment.BASE_URL}/auth/login`, formData);
  }

  getAllUsers() {
    return this.http.get<User[]>(`${environment.BASE_URL}/api/users`);
  }

  createNewUser(formData: User) {
    return this.http.post(`${environment.BASE_URL}/api/users`, formData);
  }

  getUserById(id: number) {
    return this.http.get(`${environment.BASE_URL}/api/users/${id}`);
  }

  editUser(id: number, formData: User) {
    return this.http.put(`${environment.BASE_URL}/api/users/${id}`, formData);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.BASE_URL}/api/users/${id}`);
  }
}
