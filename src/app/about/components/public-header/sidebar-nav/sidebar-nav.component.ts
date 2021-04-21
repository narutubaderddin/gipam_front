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

  home() {
    this.router.navigate(['accueil']);
    this.menu = 1;
    this.collapseMenu = !this.collapseMenu;
  }
  goToWorkOfArts() {
    this.menu = 2;
    this.router.navigate(['oeuvres-list']);
    this.collapseMenu = !this.collapseMenu;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
    this.collapseMenu = !this.collapseMenu;
  }
  goToDomainsList() {
    this.menu = 3;
    this.router.navigate(['tab-ref-domaine']);
    this.collapseMenu = !this.collapseMenu;
  }
  goToDenominationsList() {
    this.menu = 3;
    this.router.navigate(['tab-ref-dénomination']);
    this.collapseMenu = !this.collapseMenu;
  }
  goToPoratil() {
    this.menu = 4;
    this.router.navigate(['portail']);
    this.collapseMenu = !this.collapseMenu;
  }

  goToRecolementList() {
    this.router.navigate(['recolements-list']);
    this.collapseMenu = !this.collapseMenu;
  }
  goToAlertList() {
    this.router.navigate(['alerts-list']);
    this.collapseMenu = !this.collapseMenu;
  }
  goToDemandesList() {
    this.collapseMenu = !this.collapseMenu;
  }
}
