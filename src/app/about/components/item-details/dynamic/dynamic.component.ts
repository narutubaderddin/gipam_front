import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
})
export class DynamicComponent implements OnInit {
  @Input() dynamicState: boolean;
  @Output() dynamic = new EventEmitter();
  page: any = 2;

  mvtHistory: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  f1(e: any) {
    this.mvtHistory = e;

    console.log('mvtHistory', this.mvtHistory);
  }

  changeState() {
    this.dynamicState = !this.dynamicState;
    this.dynamic.emit(this.dynamicState);
  }

  page4() {
    this.page = 4;
  }
  page5() {
    this.page = 5;
  }
  page6() {
    this.page = 6;
  }
  page7() {
    this.page = 7;
  }
}
