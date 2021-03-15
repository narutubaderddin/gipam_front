import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portail-img-details',
  templateUrl: './portail-img-details.component.html',
  styleUrls: ['./portail-img-details.component.scss'],
})
export class PortailImgDetailsComponent implements OnInit {
  source: string;
  showMore: boolean;

  constructor(private route: ActivatedRoute) {}
  isCollapsed: boolean = true;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.source = params.source;
      this.showMore = JSON.parse(params.show);
      console.log(this.source, this.showMore);
    });
  }
  showDetails(e: any) {
    this.showMore = e;
  }
}
