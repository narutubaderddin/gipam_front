import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DemandService } from '@shared/services/demand.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'my-app',
  templateUrl: './in-progress-demand.html',
  styleUrls: ['./in-progress-demand.scss'],
})
export class InProgressDemandComponent {
  columns: any = [
    {
      header: 'Date de la demande',
      field: 'createdAt',
    },
    {
      header: 'Bénéficiaire',
      field: 'name',
    },
    {
      header: 'Demandeur',
      field: 'nameApplicant',
    },
    {
      header: 'Direction',
      field: 'establishement',
    },
    {
      header: 'Sous-direction',
      field: 'subDivision',
    },
    {
      header: 'Status',
      field: 'requestStatus',
    },
  ];
  expandColumns = [
    {
      header: 'N° inventaire',
      field: 'id',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'app-remarquer-details-link-render',
    },
    {
      header: 'Titre',
      field: 'title',
    },
    {
      header: 'Auteur',
      field: 'author',
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

  requests: any = [];
  loading: boolean = false;
  page: any = 1;
  constructor(private demandService: DemandService, public sharedService: SharedService) {
    this.getListDemands();
  }
  getListDemands() {
    this.loading = true;

    let payload: any = {
      page: this.page,
    };

    this.demandService.getDemands(payload).subscribe(
      (response) => {
        this.loading = false;
        this.requests = response;
        this.requests.results = this.requests.results.map((elm: any) => {
          let nameApplicant: string = '';
          if (elm.firstNameApplicant) {
            nameApplicant += elm.firstNameApplicant;
          }
          if (elm.lastNameApplicant) {
            nameApplicant += elm.lastNameApplicant;
          }
          return {
            ...elm,
            createdAt: `${this.sharedService.dateToString(elm.createdAt)}`,
            name: elm.firstName + ' ' + elm.lastName,
            nameApplicant: nameApplicant,
            expandData: elm.artWorks.map((eData: any) => {
              let authors: string = '';
              eData.authors.forEach((auth: any, index: number) => {
                authors += auth.firstName + ' ' + auth.lastName;
                if (index < eData.length - 1) {
                  authors += ', ';
                }
              });
              return {
                ...eData,
                author: authors,
              };
            }),
          };
        });
      },
      (error) => {
        //error() callback
        this.loading = false;
      },
      () => {
        //complete() callback
        this.loading = false;
      }
    );
  }

  pagination(e: any) {
    if (e.page < this.requests.totalQuantity / parseInt(this.requests.size.toString(), 0)) {
      this.requests.page = this.page = e.page + 1;
    } else {
      this.requests.page = this.requests.totalQuantity / parseInt(this.requests.size.toString(), 0);
    }
    this.getListDemands();
  }

  changeRequestStatus(request: any) {
    this.demandService.changeStatus(request).subscribe((response) => {});

    //const status = event.target.innerHTML === "Valider la demande" ? "Valider" : "Refuser";
    console.log(request);
    //console.log(event.target.attributes.id);
    this.demandService.changeStatus(request).subscribe((response) => {
      console.log(response);
    });
  }
}
