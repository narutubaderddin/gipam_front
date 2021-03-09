import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth';

@Component({
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss'],
})
export class PublicHeaderComponent implements OnInit {
  isCollapsed = false;
  menu = 1;
  isAuthentiticated: boolean = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.isAuthentiticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {}

  home() {
    this.router.navigate(['home-page']);
    this.menu = 1;
  }
  goToWorkOfArts() {
    this.menu = 2;
    this.router.navigate(['work-of-arts-list']);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  goToPoratil() {
    this.menu = 4;
    this.router.navigate(['portail']);
  }
}
