import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visible-catalog-component-render',
  templateUrl: './visible-catalog-component-render.component.html',
  styleUrls: ['./visible-catalog-component-render.component.scss'],
})
export class VisibleCatalogComponentRenderComponent implements OnInit {
  @Input() value: string = '';
  class: any;

  constructor() {}

  ngOnInit(): void {}
}
