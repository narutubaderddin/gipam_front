import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'my-app',
  templateUrl: './in-progress-demand.html',
  styleUrls: ['./in-progress-demand.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state(
        'void',
        style({
          transform: 'translateX(-10%)',
          opacity: 0,
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class InProgressDemandComponent {
  checked2: boolean = true;
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
      orders: [
        {
          id: '1002',
          productCode: 'f230fh0g3',
          date: '2019-01-04',
          amount: 65,
          quantity: 1,
          customer: 'Juan Alejandro',
          status: 'RETURNED',
        },
        {
          id: '1003',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 195,
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
      orders: [
        {
          id: '2000',
          productCode: 'nvklal433',
          date: '2020-05-14',
          amount: 72,
          quantity: 1,
          customer: 'Maisha Jefferson',
          status: 'DELIVERED',
        },
        {
          id: '2001',
          productCode: 'nvklal433',
          date: '2020-02-28',
          amount: 144,
          quantity: 2,
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
      orders: [
        {
          id: '3000',
          productCode: 'zz21cz3c1',
          date: '2020-07-05',
          amount: 79,
          quantity: 1,
          customer: 'Stacey Leja',
          status: 'DELIVERED',
        },
        {
          id: '3001',
          productCode: 'zz21cz3c1',
          date: '2020-02-06',
          amount: 79,
          quantity: 1,
          customer: 'Ashley Wickens',
          status: 'DELIVERED',
        },
      ],
    },
  ];
}
