import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-portail-item-details',
  templateUrl: './portail-item-details.component.html',
  styleUrls: ['./portail-item-details.component.scss'],
})
export class PortailItemDetailsComponent implements OnInit {
  constructor(config: NgbCarouselConfig, private _location: Location) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {}

  goBack() {
    this._location.back();
  }
}
