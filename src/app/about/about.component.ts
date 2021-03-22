import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/auth';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor() {}
  collapseSideNav: boolean = true;

  ngOnInit(): void {}
  f1(e: any) {
    this.collapseSideNav = e;
    console.log('collapseSideNav', this.collapseSideNav);
  }
}
