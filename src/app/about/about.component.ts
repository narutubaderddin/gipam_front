import { Component, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { SharedService } from '@shared/services/shared.service';

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
