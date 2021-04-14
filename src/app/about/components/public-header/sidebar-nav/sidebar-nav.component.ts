import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent implements OnInit {
  collapseMenu: boolean = true;

  @Output() open = new EventEmitter();

  menu = 1;
  isAuthentiticated: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService
  ) {
    this.isAuthentiticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {}
  // set openMenu(value: string) {
  // this.sharedService.collapseMenu = this.collapseMenu;
  // }
  toggle() {
    this.collapseMenu = !this.collapseMenu;
    console.log('collapseMenu', this.collapseMenu);
    this.open.emit(this.collapseMenu);
    this.sharedService.collapseMenu = this.collapseMenu;
    // console.log(this.sharedService.collapseMenu);
  }

  home() {
    this.router.navigate(['accueil']);
    this.menu = 1;
  }
  goToWorkOfArts() {
    this.menu = 2;
    this.router.navigate(['oeuvres-list']);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  goToPoratil() {
    this.menu = 4;
    this.router.navigate(['portail']);
  }

  goToRecolementList() {
    this.router.navigate(['recolements-list']);
  }
  goToAlertList() {
    this.router.navigate(['alerts-list']);
  }
  goToDemandesList() {}
}
