import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extra-notice-items-bloc',
  templateUrl: './extra-notice-items-bloc.component.html',
  styleUrls: ['./extra-notice-items-bloc.component.scss'],
})
export class ExtraNoticeItemsBlocComponent implements OnInit {
  @Input() domains: any;
  @Input() ministeres: any;
  @Input() keyword: string;
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
}
