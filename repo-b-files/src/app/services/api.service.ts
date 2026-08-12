import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoginRequest, User} from "../model";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import * as http from "http";

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

  getAllMachines(): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/api/machines`);
  }

  createMachine(machineName: string) {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/machines`,
      {
        name: machineName
      }
    )
  }

  startMachine(id: number): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/start/${id}`,
      {}
    );
  }

  stopMachine(id: number): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/stop/${id}`,
      {}
    );
  }

  restartMachine(id: number): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/restart/${id}`,
      {}
    );
  }

  scheduleStartMachine(id: number, date: string): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/schedule/start/${id}`,
      {
        time: date,
      }
    );
  }

  scheduleStopMachine(id: number, date: string): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/schedule/stop/${id}`,
      {
        time: date,
      }
    );
  }

  scheduleRestartMachine(id: number, date: string): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/api/machines/schedule/restart/${id}`,
      {
        time: date,
      }
    );
  }

  destroyMachine(id: number): Observable<any> {
    return this.http.delete(`${environment.BASE_URL}/api/machines/${id}`);
  }

  searchMachines(name: string, statusStopped: boolean, statusRunning: boolean, dateFrom: any, dateTo: any): Observable<any> {
    let params = new HttpParams()
    if(name) params = params.append("name", name);

    let status = "";
    const statusList = [];

    if(statusStopped) {statusList.push('STOPPED')};
    if(statusRunning) {statusList.push('RUNNING')};
    if(statusList.length > 0) {
      status = statusList.join(",");
      params = params.append("status", status)
    };

    if(dateFrom && dateTo) {
      params = params.append("dateFrom", dateFrom);
      params = params.append("dateTo", dateTo);
    }

    return this.http.get(
      `${environment.BASE_URL}/api/machines/search`,
      {
           params: params
      }
    )
  }

  getErrorLogs(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/api/logs`);
  }
}
