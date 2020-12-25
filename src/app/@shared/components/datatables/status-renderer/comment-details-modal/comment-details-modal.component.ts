import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-details-modal',
  templateUrl: './comment-details-modal.component.html',
  styleUrls: ['./comment-details-modal.component.scss'],
})
export class CommentDetailsModalComponent implements OnInit {
  comment: string;
  constructor() {}

  ngOnInit(): void {}
}
