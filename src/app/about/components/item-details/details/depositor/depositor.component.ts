import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-depositor',
  templateUrl: './depositor.component.html',
  styleUrls: ['./depositor.component.scss'],
})
export class DepositorComponent implements OnInit {
  edit: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
