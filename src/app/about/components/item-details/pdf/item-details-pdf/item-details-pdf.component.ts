import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-details-pdf',
  templateUrl: './item-details-pdf.component.html',
  styleUrls: ['./item-details-pdf.component.scss'],
})
export class ItemDetailsPdfComponent implements OnInit {
  @Input() artWorksToPrint: any = [];
  constructor() {}

  ngOnInit(): void {}
}
