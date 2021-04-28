import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-remarquer-details-link-renderer',
  templateUrl: './remarquer-details-link-renderer.component.html',
  styleUrls: ['./remarquer-details-link-renderer.component.scss'],
})
export class RemarquerDetailsLinkRendererComponent implements OnInit {
  @Input() value: string = '';

  constructor() {}

  ngOnInit(): void {}
}
