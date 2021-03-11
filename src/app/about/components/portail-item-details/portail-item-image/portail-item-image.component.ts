import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portail-item-image',
  templateUrl: './portail-item-image.component.html',
  styleUrls: ['./portail-item-image.component.scss'],
})
export class PortailItemImageComponent implements OnInit {
  show: boolean;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.show = JSON.parse(params.show);
      console.log(params.show);
    });
  }
}
