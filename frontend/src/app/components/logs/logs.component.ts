import {Component, OnInit, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';

import {ApiService} from '../../services/api.service';
import {ErrorMessage} from '../../model';

@Component({
  selector: 'app-logs',
  imports: [DatePipe],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  private readonly api = inject(ApiService);

  readonly errorLogs = signal<ErrorMessage[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getErrorLogs().subscribe({
      next: logs => {
        this.errorLogs.set(logs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

}
