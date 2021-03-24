import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent implements OnInit {
  classApplied: boolean = true;
  @Output() open = new EventEmitter();

  menu = 1;
  isAuthentiticated: boolean = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.isAuthentiticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {}

  toggle() {
    this.classApplied = !this.classApplied;
    this.open.emit(this.classApplied);
  }

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
