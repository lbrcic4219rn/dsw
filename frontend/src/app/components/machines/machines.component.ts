import {Component, OnInit, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

import {UserService} from '../../services/user.service';
import {ApiService} from '../../services/api.service';
import {NotificationService} from '../../services/notification.service';
import {Machine} from '../../model';

const REFRESH_AFTER_OPERATION_MS = 15000;

@Component({
  selector: 'app-machines',
  imports: [FormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);
  readonly userService = inject(UserService);

  readonly machines = signal<Machine[]>([]);
  readonly loading = signal(false);
  /** Ids with an in-flight request, so only that card's buttons disable. */
  readonly busyIds = signal<ReadonlySet<number>>(new Set());

  scheduleDate = '';

  machineNameFilter = '';
  statusRunning = false;
  statusStopped = false;
  dateFrom = '';
  dateTo = '';

  ngOnInit(): void {
    this.refresh();
  }

  isBusy(machine: Machine): boolean {
    return this.busyIds().has(machine.id) || machine.operationActive;
  }

  refresh(showSpinner = true): void {
    if (showSpinner) {
      this.loading.set(true);
    }
    this.api.getAllMachines().subscribe({
      next: machines => {
        this.machines.set(machines);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  startMachine(machine: Machine): void {
    this.runOperation(machine, this.api.startMachine(machine.id), 'Start requested');
  }

  stopMachine(machine: Machine): void {
    this.runOperation(machine, this.api.stopMachine(machine.id), 'Stop requested');
  }

  restartMachine(machine: Machine): void {
    this.runOperation(machine, this.api.restartMachine(machine.id), 'Restart requested');
  }

  destroyMachine(machine: Machine): void {
    if (!confirm(`Destroy "${machine.name}"? This cannot be undone.`)) {
      return;
    }
    this.runOperation(machine, this.api.destroyMachine(machine.id), 'Machine destroyed', false);
  }

  scheduleStart(machine: Machine): void {
    this.schedule(machine, id => this.api.scheduleStartMachine(id, this.scheduleTime()), 'start');
  }

  scheduleStop(machine: Machine): void {
    this.schedule(machine, id => this.api.scheduleStopMachine(id, this.scheduleTime()), 'stop');
  }

  scheduleRestart(machine: Machine): void {
    this.schedule(machine, id => this.api.scheduleRestartMachine(id, this.scheduleTime()), 'restart');
  }

  search(): void {
    if ((this.dateFrom && !this.dateTo) || (!this.dateFrom && this.dateTo)) {
      this.notifications.error('Select both date filters, or neither.');
      return;
    }

    this.loading.set(true);
    this.api.searchMachines({
      name: this.machineNameFilter.trim(),
      statusRunning: this.statusRunning,
      statusStopped: this.statusStopped,
      dateFrom: this.datePipe.transform(this.dateFrom, 'dd-MM-yyyy'),
      dateTo: this.datePipe.transform(this.dateTo, 'dd-MM-yyyy')
    }).subscribe({
      next: machines => {
        this.machines.set(machines);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resetSearch(): void {
    this.machineNameFilter = '';
    this.statusRunning = false;
    this.statusStopped = false;
    this.dateFrom = '';
    this.dateTo = '';
    this.refresh();
  }

  private scheduleTime(): string {
    return this.scheduleDate.replace('T', ' ');
  }

  private schedule(machine: Machine,
                   call: (id: number) => Observable<void>,
                   label: string): void {
    if (!this.scheduleDate) {
      this.notifications.error('Pick a date and time first.');
      return;
    }
    this.markBusy(machine.id, true);
    call(machine.id).subscribe({
      next: () => {
        this.markBusy(machine.id, false);
        this.notifications.success(`Scheduled ${label} for "${machine.name}".`);
      },
      error: () => this.markBusy(machine.id, false)
    });
  }

  private runOperation(machine: Machine,
                       request: Observable<void>,
                       message: string,
                       repollLater = true): void {
    this.markBusy(machine.id, true);
    request.subscribe({
      next: () => {
        this.markBusy(machine.id, false);
        this.notifications.success(`${message}: "${machine.name}".`);
        this.refresh(false);
        if (repollLater) {
          setTimeout(() => this.refresh(false), REFRESH_AFTER_OPERATION_MS);
        }
      },
      error: () => this.markBusy(machine.id, false)
    });
  }

  private markBusy(id: number, busy: boolean): void {
    this.busyIds.update(ids => {
      const next = new Set(ids);
      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
