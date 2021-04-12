import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hypertext-links',
  templateUrl: './hypertext-links.component.html',
  styleUrls: ['./hypertext-links.component.scss'],
})
export class HypertextLinksComponent implements OnInit {
  @Input() add: false;
  constructor() {}

  ngOnInit(): void {}
}
