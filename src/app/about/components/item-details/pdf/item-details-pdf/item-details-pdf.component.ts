import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-details-pdf',
  templateUrl: './item-details-pdf.component.html',
  styleUrls: ['./item-details-pdf.component.scss'],
})
export class ItemDetailsPdfComponent implements OnInit {
  @Input() artwork = {
    id: 15,
    title: 'Titre de la sculpture',
    domain: 'Sculpture',
    height: '85',
    width: '85',
    author: 'Auteur 1, Auteur 11',
  };
  constructor() {}

  ngOnInit(): void {}
}
