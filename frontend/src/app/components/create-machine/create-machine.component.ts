import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-machine',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css']
})
export class CreateMachineComponent {
  machineName: string = "";

  private readonly api = inject(ApiService);
  readonly userService = inject(UserService);

  createMachine() {
    if (this.machineName.trim().length == 0) {
      alert("machine name is required");
      return;
    }
    this.api.createMachine(this.machineName.trim()).subscribe({
      next: () => {
        alert("Machine created");
        this.machineName = "";
      },
      error: error => {
        alert("error: " + error);
      }
    })
  }
}
