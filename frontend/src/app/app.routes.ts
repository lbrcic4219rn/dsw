import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { MachinesComponent } from './components/machines/machines.component';
import { CreateMachineComponent } from './components/create-machine/create-machine.component';
import { LogsComponent } from './components/logs/logs.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateUserComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    pathMatch: 'full',
    component: EditUserComponent,
    canActivate: [authGuard]
  },
  {
    path: 'machines',
    component: MachinesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create-machine',
    component: CreateMachineComponent,
    canActivate: [authGuard]
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [authGuard]
  }
];
