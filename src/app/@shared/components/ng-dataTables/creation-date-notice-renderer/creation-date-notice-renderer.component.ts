import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-creation-date-notice-renderer',
  templateUrl: './creation-date-notice-renderer.component.html',
  styleUrls: ['./creation-date-notice-renderer.component.scss'],
})
export class CreationDateNoticeRendererComponent implements OnInit {
  @Input() value: any;
  constructor() {}

  ngOnInit(): void {}
}
