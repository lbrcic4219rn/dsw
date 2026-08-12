import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { Machine } from '../../model';

@Component({
  selector: 'app-machines',
  imports: [CommonModule, FormsModule],
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {
  datePipe = new DatePipe('en-US');

  scheduleDate: any;
  machines: Machine[] = []

  //SEARCH
  machineNameFilter: string = "";
  statusRunning: boolean = false;
  statusStopped: boolean = false;
  dateFrom!: string;
  dateTo!: string;

  private readonly api = inject(ApiService);
  readonly userService = inject(UserService);

  ngOnInit(): void {
    this.refreshMachines();
  }

  private refreshMachines(delayedRefreshMs?: number) {
    this.api.getAllMachines().subscribe(
      (data: Machine[]) => {
        this.machines = data
        if (delayedRefreshMs) {
          setTimeout(() => this.refreshMachines(), delayedRefreshMs);
        }
      }
    )
  }

  startMachine(id: number) {
    this.api.startMachine(id).subscribe(
      () => {
        alert("started machine");
        this.refreshMachines(15000);
      }
    )
  }

  stopMachine(id: number) {
    this.api.stopMachine(id).subscribe(
      () => {
        alert("stopped machine");
        this.refreshMachines(15000);
      }
    )
  }

  restartMachine(id: number) {
    this.api.restartMachine(id).subscribe(
      () => {
        alert("stopped machine");
        this.refreshMachines(30000);
      }
    )
  }

  scheduleStartMachine(id: number) {
    if (!this.scheduleDate) {
      alert('Please select a date');
      return;
    }

    this.api.scheduleStartMachine(id, this.scheduleDate.replace('T', ' ')).subscribe(
      () => {
        alert('Machine start scheduled');
      }
    )
  }

  scheduleStopMachine(id: number) {
    if (!this.scheduleDate) {
      alert('Please select a date');
      return;
    }

    this.api.scheduleStopMachine(id, this.scheduleDate.replace('T', ' ')).subscribe(
      () => {
        alert('Machine stop scheduled');
      }
    )
  }

  scheduleRestartMachine(id: number) {
    if (!this.scheduleDate) {
      alert('Please select a date');
      return;
    }

    this.api.scheduleRestartMachine(id, this.scheduleDate.replace('T', ' ')).subscribe(
      () => {
        alert('Machine restart scheduled');
      }
    )
  }

  destroyMachine(id: number) {
    this.api.destroyMachine(id).subscribe(
      () => {
        alert('Machine destroyed');
        this.refreshMachines();
      }
    )
  }

  search() {
    if ((this.dateFrom && !this.dateTo) || (!this.dateFrom && this.dateTo)) {
      alert('Please select both date filters or none.')
      return;
    }

    this.api.searchMachines(
      this.machineNameFilter,
      this.statusStopped,
      this.statusRunning,
      this.datePipe.transform(this.dateFrom, 'dd-MM-yyyy'),
      this.datePipe.transform(this.dateTo, 'dd-MM-yyyy')
    ).subscribe(
      (data: Machine[]) => {
        this.machines = data
      }
    )
  }
}
