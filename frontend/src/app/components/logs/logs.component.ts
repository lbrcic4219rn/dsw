import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../services/api.service';
import { ErrorMessage } from '../../model';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  errorLogs: ErrorMessage[] = [];

  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.api.getErrorLogs().subscribe({
      next: (logs: ErrorMessage[]) => {
        this.errorLogs = logs
      },
      error: error => console.log(error)
    })
  }

}
