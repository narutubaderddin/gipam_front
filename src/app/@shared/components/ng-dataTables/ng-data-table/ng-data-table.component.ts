import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.scss'],
})
export class NgDataTableComponent implements OnInit {
  @Input() columns: any[];
  constructor() {}

  ngOnInit(): void {}
}
