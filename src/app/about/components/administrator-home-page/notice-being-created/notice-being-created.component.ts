import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-notice-being-created',
  templateUrl: './notice-being-created.component.html',
  styleUrls: ['./notice-being-created.component.scss'],
})
export class NoticeBeingCreatedComponent implements OnInit {
  remarquers: any;

  pinnedCols: string[] = ['action'];
  leftPinnedCols: string[] = ['id'];

  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.oeuvres;
  }
}
