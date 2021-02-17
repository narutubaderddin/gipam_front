import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-author-bloc',
  templateUrl: './author-bloc.component.html',
  styleUrls: ['./author-bloc.component.scss'],
})
export class AuthorBlocComponent implements OnInit {
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
