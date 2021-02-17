import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-description-bloc',
  templateUrl: './description-bloc.component.html',
  styleUrls: ['./description-bloc.component.scss'],
})
export class DescriptionBlocComponent implements OnInit {
  @Input() domains: any;
  @Input() keyword: string;
  denomination: any;
  selectedDomain: any;
  isCollapsed = false;
  constructor() {}

  ngOnInit(): void {}
  selectDomain(item: any) {
    this.denomination = item.denominations;
    this.selectedDomain = item.name;
  }
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
