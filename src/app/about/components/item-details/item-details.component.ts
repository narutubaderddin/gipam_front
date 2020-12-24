import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  page: any = 1;
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  constructor(config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {}

  page1() {
    this.page = 1;
  }
  page2() {
    this.page = 2;
  }
  page3() {
    this.page = 3;
  }
  page4() {
    this.page = 4;
  }
  page5() {
    this.page = 5;
  }
}
