import { Component, Input, OnInit } from '@angular/core';

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
