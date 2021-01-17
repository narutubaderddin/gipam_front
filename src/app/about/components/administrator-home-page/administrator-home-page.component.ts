import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrator-home-page',
  templateUrl: './administrator-home-page.component.html',
  styleUrls: ['./administrator-home-page.component.scss'],
})
export class AdministratorHomePageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
}
