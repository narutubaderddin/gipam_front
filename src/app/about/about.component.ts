import { Component, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(private router: Router) {}
  collapseSideNav: boolean = true;

  ngOnInit(): void {}
  f1(e: any) {
    this.collapseSideNav = e;
    // console.log('collapseSideNav', this.collapseSideNav);
  }

  onSearchClick() {
    this.router.navigate(['oeuvres-list']);
  }
  createNotice() {
    this.router.navigate(['creation-notice', 'propriété']);
  }
  createDepositNotice() {
    this.router.navigate(['creation-notice', 'dépôt']);
  }
}
