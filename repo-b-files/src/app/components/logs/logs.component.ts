import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ErrorMessage} from "../../model";
import {catchError, tap} from "rxjs";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  errorLogs: ErrorMessage[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getErrorLogs().subscribe(
      (logs: ErrorMessage[]) => {
        this.errorLogs = logs
      },
      error => console.log(error),
    )
  }

}
