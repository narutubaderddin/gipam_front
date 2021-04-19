import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-actions-cell',
  templateUrl: './actions-cell.component.html',
  styleUrls: ['./actions-cell.component.scss'],
})
export class ActionsCellComponent implements OnInit {
  @Input() value: string = '';
  class: any;

  constructor() {}

  ngOnInit(): void {}
}
