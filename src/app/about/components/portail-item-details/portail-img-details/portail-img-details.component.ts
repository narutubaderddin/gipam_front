import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portail-img-details',
  templateUrl: './portail-img-details.component.html',
  styleUrls: ['./portail-img-details.component.scss'],
})
export class PortailImgDetailsComponent implements OnInit {
  source: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.source = params.source;
      console.log(this.source);
    });
  }
}
