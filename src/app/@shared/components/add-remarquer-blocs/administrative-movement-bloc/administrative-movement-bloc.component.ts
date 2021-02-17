import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-administrative-movement-bloc',
  templateUrl: './administrative-movement-bloc.component.html',
  styleUrls: ['./administrative-movement-bloc.component.scss'],
})
export class AdministrativeMovementBlocComponent implements OnInit {
  @Input() domains: any;
  @Input() ministeres: any;
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
