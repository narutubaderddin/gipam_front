import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'my-app',
  templateUrl: './in-progress-demand.html',
  styleUrls: ['./in-progress-demand.scss'],
})
export class InProgressDemandComponent {
  columns: any = [
    {
      header: 'Date de la demande',
      field: 'date',
    },

    {
      header: 'Demandé par ',
      field: 'name',
    },
    {
      header: 'Direction',
      field: 'category',
    },
    {
      header: 'Sous-direction',
      field: 'name',
    },
    {
      header: 'Date de livraision souhaité',
      field: 'inventoryStatus',
    },
  ];
  expandColumns = [
    {
      header: 'Numéro inventaire',
      field: 'id',
    },
    {
      header: '',
      field: 'select',
      type: 'app-select-button-render',
    },
  ];

  products: any[] = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      date: '2020-09-13',
      rating: 5,
      expandData: [
        {
          id: '1002',
          productCode: 'f230fh0g3',
          date: '2019-01-04',
          amount: 65,
          select: 'oui',
          quantity: 1,
          customer: 'Juan Alejandro',
          status: 'RETURNED',
        },
        {
          id: '1003',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 195,
          select: 'oui',
          quantity: 3,
          customer: 'Claire Morrow',
          status: 'CANCELLED',
        },
      ],
    },
    {
      id: '1001',
      code: 'nvklal433',
      name: 'Black Watch',
      description: 'Product Description',
      image: 'black-watch.jpg',
      price: 72,
      category: 'Accessories',
      quantity: 61,
      inventoryStatus: 'INSTOCK',
      rating: 4,
      date: '2019-01-04',
      expandData: [
        {
          id: '2000',
          productCode: 'nvklal433',
          date: '2020-05-14',
          amount: 72,
          quantity: 1,
          select: 'non',
          customer: 'Maisha Jefferson',
          status: 'DELIVERED',
        },
        {
          id: '2001',
          productCode: 'nvklal433',
          date: '2020-02-28',
          amount: 144,
          quantity: 2,
          select: 'oui',
          customer: 'Octavia Murillo',
          status: 'PENDING',
        },
      ],
    },
    {
      id: '1002',
      code: 'zz21cz3c1',
      name: 'Blue Band',
      description: 'Product Description',
      image: 'blue-band.jpg',
      price: 79,
      category: 'Fitness',
      quantity: 2,
      inventoryStatus: 'LOWSTOCK',
      date: '2020-07-05',
      rating: 3,
      expandData: [
        {
          id: '3000',
          productCode: 'zz21cz3c1',
          date: '2020-07-05',
          amount: 79,
          select: 'oui',
          quantity: 1,
          customer: 'Stacey Leja',
          status: 'DELIVERED',
        },
        {
          id: '3001',
          productCode: 'zz21cz3c1',
          date: '2020-02-06',
          amount: 79,
          select: 'non',
          quantity: 1,
          customer: 'Ashley Wickens',
          status: 'DELIVERED',
        },
      ],
    },
  ];
  constructor() {}
}
