import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portail-item-image',
  templateUrl: './portail-item-image.component.html',
  styleUrls: ['./portail-item-image.component.scss'],
})
export class PortailItemImageComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
