import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {
  ErrorMessage,
  LoginRequest,
  Machine,
  MachineSearchFilters,
  Session,
  User,
  UserPayload
} from '../model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);
  private readonly base = environment.BASE_URL;

  // ---- auth ----

  login(credentials: LoginRequest): Observable<Session> {
    return this.http.post<Session>(`${this.base}/auth/login`, credentials);
  }

  me(): Observable<Session> {
    return this.http.get<Session>(`${this.base}/auth/me`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {});
  }

  // ---- users ----

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/api/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/api/users/${id}`);
  }

  createNewUser(payload: UserPayload): Observable<User> {
    return this.http.post<User>(`${this.base}/api/users`, payload);
  }

  editUser(id: number, payload: UserPayload): Observable<User> {
    return this.http.put<User>(`${this.base}/api/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/users/${id}`);
  }

  // ---- machines ----

  getAllMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.base}/api/machines`);
  }

  createMachine(name: string): Observable<Machine> {
    return this.http.post<Machine>(`${this.base}/api/machines`, {name});
  }

  startMachine(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/start/${id}`, {});
  }

  stopMachine(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/stop/${id}`, {});
  }

  restartMachine(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/restart/${id}`, {});
  }

  scheduleStartMachine(id: number, time: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/schedule/start/${id}`, {time});
  }

  scheduleStopMachine(id: number, time: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/schedule/stop/${id}`, {time});
  }

  scheduleRestartMachine(id: number, time: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/api/machines/schedule/restart/${id}`, {time});
  }

  destroyMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/machines/${id}`);
  }

  searchMachines(filters: MachineSearchFilters): Observable<Machine[]> {
    let params = new HttpParams();

    if (filters.name) {
      params = params.append('name', filters.name);
    }

    const statuses: string[] = [];
    if (filters.statusStopped) statuses.push('STOPPED');
    if (filters.statusRunning) statuses.push('RUNNING');
    if (statuses.length > 0) {
      params = params.append('status', statuses.join(','));
    }

    if (filters.dateFrom && filters.dateTo) {
      params = params.append('dateFrom', filters.dateFrom);
      params = params.append('dateTo', filters.dateTo);
    }

    return this.http.get<Machine[]>(`${this.base}/api/machines/search`, {params});
  }

  // ---- logs ----

  getErrorLogs(): Observable<ErrorMessage[]> {
    return this.http.get<ErrorMessage[]>(`${this.base}/api/logs`);
  }
}
