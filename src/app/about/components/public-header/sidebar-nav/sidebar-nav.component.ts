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
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService
  ) {
    this.isAuthentiticated = authenticationService.isAuthenticated();
    this.isAdmin = authenticationService.isAdmin();
    console.log(this.isAdmin);
  }

  ngOnInit(): void {}

  toggle() {
    this.collapseMenu = !this.collapseMenu;

    this.open.emit(this.collapseMenu);
    this.sharedService.collapseMenu = this.collapseMenu;
  }
  toggleClose() {
    this.collapseMenu = true;

    this.open.emit(this.collapseMenu);
    this.sharedService.collapseMenu = this.collapseMenu;
  }

  home() {
    this.router.navigate(['accueil']);
    this.menu = 1;
    this.toggleClose();
  }
  goToWorkOfArts() {
    this.menu = 2;
    this.router.navigate(['oeuvres-list']);
    this.toggleClose();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
  goToDomainsList() {
    this.menu = 3;
    this.router.navigate(['tab-ref-domaine']);
    this.toggleClose();
  }
  goToDenominationsList() {
    this.menu = 3;
    this.router.navigate(['tab-ref-dénomination']);
    this.toggleClose();
  }
  goToPoratil() {
    this.menu = 4;
    this.router.navigate(['portail']);
    this.toggleClose();
  }

  goToRecolementList() {
    this.router.navigate(['recolements-list']);
    this.toggleClose();
  }
  goToAlertList() {
    this.router.navigate(['alerts-list']);
    this.toggleClose();
  }
  goToDemandesList() {
    this.toggleClose();
  }
}
