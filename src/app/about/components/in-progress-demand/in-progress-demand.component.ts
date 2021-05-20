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
      sortable: true,
      filter: true,
      type: 'key',
      filterType: 'range-date',
    },
    {
      header: 'Bénéficiaire',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text',
    },
    {
      header: 'Demandeur',
      field: 'nameApplicant',
      filter: true,
      sortable: true,
      filterType: 'text',
    },
    {
      header: 'Direction',
      field: 'establishement',
      filter: true,
      sortable: true,
      filterType: 'text',
    },
    {
      header: 'Sous-direction',
      field: 'subDivision',
      filter: true,
      sortable: true,
      filterType: 'text',
    },
    {
      header: 'Status',
      field: 'requestStatus',
      cellRenderer: 'statusTypeRender',
      sortable: false,
      filter: true,
      type: 'app-status-component-render',
      filterType: 'multiselect',
      selectData: this.demandService.statusType,
      isVisible: true,
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
      field: 'authorsName',
    },
    {
      header: '',
      field: 'select',
      type: 'app-select-button-render',
    },
  ];


  requests: any = [];
  loading: boolean = false;
  isValidationRequest: boolean = false;
  isCancelingRequest: boolean = false;
  page: any = 1;
  filter: any = "";
  constructor(private demandService: DemandService, public sharedService: SharedService) {
    this.getListDemands();
  }
  getListDemands(params:any=null) {
    this.loading = true;

    let payload: any = {
      page: this.page,
    };
    let filter = '?sort_by=createdAt&sort=desc&limit=5&page='+this.page;
    if(params){
      filter+=params;
    }


    this.demandService.getDemands(filter).subscribe(
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
          let expendDatas : any = [];
          let validatedRequestArtWork : any = [];
          elm.requestedArtWorks.forEach((requestedArtWork:any)=>{
            if(requestedArtWork.status == 'Accepté' || requestedArtWork.status == 'Refusé'){
              validatedRequestArtWork.push(requestedArtWork);
            }
            expendDatas.push({
              ...requestedArtWork.artWork,
              status: requestedArtWork.status,
              requestedArtWorkId: requestedArtWork.id,
            })
          });
          return {
            ...elm,
            createdAt: `${this.sharedService.dateToString(elm.createdAt)}`,
            name: elm.firstName + ' ' + elm.lastName,
            nameApplicant: nameApplicant,
            expandData: expendDatas,
            validatedRequestArtWork: validatedRequestArtWork
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
    this.getListDemands(this.filter);
  }

  changeRequestStatus($event: any) {
    let payload : any  = {...$event.request};
    if($event.status=="Annulée"){
      this.isCancelingRequest = true;
    }else{
      this.isValidationRequest = true;
    }
    this.demandService.changeStatus(payload).subscribe((response) => {
      this.isValidationRequest = this.isCancelingRequest = false;
    });
  }
  onDataTableFilterChange(headersFilter: any) {
    let filter : string = "";
    if(headersFilter.establishement){
      filter+='&establishement[contains]='+headersFilter.establishement.value;
    }
    if(headersFilter.subDivision){
      filter+='&subDivision[contains]='+headersFilter.subDivision.value;
    }
    if(headersFilter.name){
      filter+='&search='+headersFilter.name.value;
    }
    if(headersFilter.nameApplicant){
      filter+='&search='+headersFilter.nameApplicant.value;
    }
    if(headersFilter.requestStatus){
      let status : any = [];
      headersFilter.requestStatus.value.forEach((stat:any)=>{
        status.push('"'+stat.name+'"');
      });
      filter+='&requestStatus[in]=['+status+']';
    }
    if(headersFilter.createdAt){
      if(headersFilter.createdAt.operator === 'eq'){
        filter+='&createdAt[equalDate]='+headersFilter.createdAt.value;
      }else {
        filter+=`&createdAt[${headersFilter.createdAt.operator}]=`+headersFilter.createdAt.value;
      }
    }
    this.filter = filter;
    this.getListDemands(filter);
  }

  sortEvent(e: any) {
    let sortBy = e.sort_by;
    if(sortBy==='name'){
      sortBy = 'firstName';
    }
    if(sortBy==='nameApplicant'){
      sortBy = 'firstNameApplicant';
    }
    let filter = `&sort_by=${sortBy}&sort=${e.sort}`;
    this.filter+=filter;
    this.getListDemands(filter);
  }

}
