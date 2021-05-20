import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastArtOfWorkDetailIndex } from '@shared/utils/helpers';

@Component({
  selector: 'app-remarquer-details-link-renderer',
  templateUrl: './remarquer-details-link-renderer.component.html',
  styleUrls: ['./remarquer-details-link-renderer.component.scss'],
})
export class RemarquerDetailsLinkRendererComponent implements OnInit {
  @Input() value: string = '';
  @Input() rowNumber: number;
  constructor() {}

  ngOnInit(): void {}

  saveArtOfWorkIndex() {
    localStorage.setItem(lastArtOfWorkDetailIndex, JSON.stringify(this.rowNumber));
  }
}
