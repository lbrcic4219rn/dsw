import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css']
})
export class CreateMachineComponent implements OnInit {
  machineName: string= "";

  constructor(
    private api: ApiService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

  createMachine() {
    if(this.machineName.trim().length == 0) {
      alert("machine name is required");
      return;
    }
    this.api.createMachine(this.machineName.trim()).subscribe(
      res => {
        alert("Machine created");
        this.machineName = "";
      },
      error => {
        alert("error: " + error);
      }
    )
  }
}
