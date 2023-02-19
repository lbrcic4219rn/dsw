import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {CreateUserComponent} from "./components/create-user/create-user.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";
import {MachinesComponent} from "./components/machines/machines.component";
import {CreateMachineComponent} from "./components/create-machine/create-machine.component";
import {LogsComponent} from "./components/logs/logs.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    pathMatch: "full",
    component: LoginComponent,
  },
  {
    path: "create",
    pathMatch: "full",
    component: CreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:id",
    pathMatch: "full",
    component: EditUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'machines',
    component: MachinesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-machine',
    component: CreateMachineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
