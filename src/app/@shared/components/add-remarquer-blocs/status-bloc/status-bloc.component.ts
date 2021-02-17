import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-bloc',
  templateUrl: './status-bloc.component.html',
  styleUrls: ['./status-bloc.component.scss'],
})
export class StatusBlocComponent implements OnInit {
  @Input() domains: any;
  @Input() keyword: string;
  isCollapsed = false;
  constructor() {}

  ngOnInit(): void {}
  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
