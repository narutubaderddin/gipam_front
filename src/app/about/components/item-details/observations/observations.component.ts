import { Component, OnInit } from '@angular/core';
import { TimelineItem } from 'ngx-horizontal-timeline';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit {
  items: TimelineItem[] = [];
  constructor() {}
  constatActions: any = [
    {
      date: '20/01/2020',
      type: 'En recherche',
      author: 'Paul B',
      status: 'terminé',
    },
    {
      date: '20/04/2020',
      type: 'En recherche',
      author: 'Paul',
      status: 'alert',
    },
    {
      date: '20/06/2020',
      type: 'Dépôt des plaintes',
      author: 'Olive T',
      status: 'terminé',
    },
    {
      date: '20/01/2021',
      type: 'Abandon des recherches',
      author: 'Pascal',
      status: 'en cours',
    },
  ];
  ngOnInit() {
    this.items.push({
      label: 'Test 1',
      icon: 'glyphicon glyphicon-adjust',
      active: true,
      title: 'Example 1',
      color: '16a085',
      command() {
        console.log('Action 1');
      },
    });

    this.items.push({
      label: 'Test 2',
      icon: 'fa fa-plus',
      title: 'Example 2',
      color: '2980b9',
      command() {
        console.log('Action 2');
      },
    });
  }
}
