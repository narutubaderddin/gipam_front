import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-progress-notice-renderer',
  templateUrl: './in-progress-notice-renderer.component.html',
  styleUrls: ['./in-progress-notice-renderer.component.scss'],
})
export class InProgressNoticeRendererComponent implements OnInit {
  @Input() value: any = '';
  statusType: string;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.value.status.statusType == 'DepositStatus' ? (this.statusType = 'dépôt') : (this.statusType = 'propriété');
  }
  goToCreation(value: any) {
    this.router.navigate(['/creation-notice', this.statusType], { queryParams: { id: this.value.id } });
  }
}
