import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portail-item-details',
  templateUrl: './portail-item-details.component.html',
  styleUrls: ['./portail-item-details.component.scss'],
})
export class PortailItemDetailsComponent implements OnInit {
  constructor(config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {}
}
