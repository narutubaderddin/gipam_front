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
  isAuthentiticated: boolean = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.isAuthentiticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {}

  home() {
    this.router.navigate(['home-page']);
  }
  goToWorkOfArts() {
    this.router.navigate(['work-of-arts-list']);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
