import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-button-render',
  templateUrl: './select-button-render.component.html',
  styleUrls: ['./select-button-render.component.scss'],
})
export class SelectButtonRenderComponent implements OnInit {
  @Input() value: string;
  stateOptions: any[];
  constructor() {}

  ngOnInit(): void {
    this.stateOptions = [
      { label: 'Accepté', value: 'oui' },
      { label: 'Refusé', value: 'non' },
    ];
  }
}
