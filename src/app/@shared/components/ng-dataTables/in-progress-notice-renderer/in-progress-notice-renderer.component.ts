import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-progress-notice-renderer',
  templateUrl: './in-progress-notice-renderer.component.html',
  styleUrls: ['./in-progress-notice-renderer.component.scss'],
})
export class InProgressNoticeRendererComponent implements OnInit {
  @Input() value: any = '';
  constructor(private router: Router) {}

  ngOnInit(): void {}
  goToCreation(value: any) {
    console.log(value);
    this.router.navigate(['/creation-notice/propriété']);
  }
}
