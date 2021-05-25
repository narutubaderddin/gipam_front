import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { MessageService } from 'primeng/api';
import { dateTimeFormat, lastArtOfWorkDetailIndex, searchPageFilter } from '@shared/utils/helpers';
import { DatePipe } from '@angular/common';
import { ArtWorkService } from '@app/about/services/art-work.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  providers: [DatePipe],
})
export class ItemDetailsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  @ViewChild('accordionDOM') public parentRef: ElementRef<HTMLElement>;
  @ViewChild('stickyMenu') menuElement: ElementRef;

  btnLoading: any = null;
  attributes: any[] = [];
  elementPosition: any = 2;
  workArt: {
    id: 145;
    titre: 'Titre';
    domain: 'Art graphique';
    field: { id: 1; label: 'Art graphique' };
    height: '85';
    width: '85';
    authors: 'Auteur 1, Auteur 11';
    totalWidth: '';
    totalHeight: '';
    era: '';
    materialTechnique: '';
    status: '';
    denomination: { id: 1; label: 'Affiche' };
    createdAt: '22/01/2020';
  };
  editLink: boolean = true;
  parent: any = '';
  children: any = [];
  hyperLinkData: any[] = [];
  attachments: any[] = [];
  status: any = {};
  type = 'depot';
  addProperty = false;
  addDepot = false;
  edit = false;
  depositStatusForm: FormGroup;
  descriptifForm: FormGroup;
  attachmentForm: FormGroup;
  propertyStatusForm: FormGroup;
  linksForm: FormGroup;
  linkArtWorkForm: FormGroup;
  photographies: any[] = [];
  imgSrc: string = this.photographies[0] ? this.photographies[0].imageUrl : '';
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  strIntoObj: any[] = [];
  dynamic = false;
  openImg = false;
  sticky = false;

  photographiesForm: FormGroup;
  artWorkId: any;
  artwork = {
    id: 145,
    titre: 'Titre',
    domain: 'Art graphique',
    field: 'Art graphique',
    height: '85',
    width: '85',
    authors: 'Auteur 1, Auteur 11',
    totalWidth: '',
    totalHeight: '',
    era: '',
    materialTechnique: '',
    status: '',
    denomination: 'Affiche',
    createdAt: '22/01/2020',
  };
  artWorksToPrint: any = [];

  currentId: string;
  nextId: number;
  previousId: number;
  paginationIds: {
    current: number;
    next: number;
    previous: number;
  };

  page = 1;
  artWorkIds: any[] = [];
  searchPageParam: {
    mode: any;
    filter: any;
    advancedFilter: any;
    headerFilters: any;
    page: any;
    limit: any;
    sortBy: any;
    sort: any;
    globalSearch: any;
    searchQuery: any;
    totalFiltered: any;
  };
  loadingData = false;
  private draftArtWork: boolean;
  constructor(
    config: NgbCarouselConfig,
    private notificationsService: NotificationsService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private pdfGeneratorService: PdfGeneratorService,
    private route: ActivatedRoute,
    private workOfArtService: WorkOfArtService,
    private artWorkService: ArtWorkService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {
    this.artWorkId = this.route.snapshot.paramMap.get('id');
    this.initSearchPageParam();

    this.initPhotographiesForm();
    this.initAttachmentForm();
    this.initPropertyStatusForm();
    this.initDepositStatusForm();
    this.initHyperLink();
    this.initLinks();
    this.setPage();
    this.paginate();
  }

  getParentApi(): ParentComponentApi {
    return {
      callParentMethod: (id) => {
        this.getArtWork(id);
      },
    };
  }

  getParentlinkApi(): ParentComponentApi {
    return {
      callParentMethod: () => {},
    };
  }
  initPhotographiesForm() {
    this.photographiesForm = new FormGroup({
      photographies: this.fb.array([]),
    });
  }
  initAttachmentForm() {
    this.attachmentForm = new FormGroup({
      attachments: this.fb.array([]),
    });
  }
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
  getTabRefData(result: any[]) {
    let items: any[] = [];
    result?.forEach((item: any) => {
      if (item.hasOwnProperty('label')) {
        items.push({ id: item.id, name: item.label });
      } else {
        items.push({ id: item.id, name: item.name });
      }
    });
    return items;
  }
  formatArray(array: any) {
    let test: any[] = [];
    if (array.length) {
      array.forEach((value: any) => {
        test.push(value.id);
      });
      return test;
    }
    return null;
  }
  initDescriptifForm(data?: any) {
    this.descriptifForm = this.fb.group({
      title: [data?.title, Validators.required],
      field: [{ id: data?.field?.id, name: data?.field.label }, Validators.required],
      denomination: [{ id: data?.denomination?.id, name: data?.denomination.label }, Validators.required],
      materialTechnique: [
        data && data.materialTechnique ? this.formatArray(data.materialTechnique) : null,
        Validators.required,
      ],

      numberOfUnit: [data && data.numberOfUnit ? data.numberOfUnit : null, Validators.required],
      authors: [data && data.authors ? this.formatArray(data.authors) : null],
      creationDate: [data && data.creationDate ? this.datePipe.transform(data?.creationDate, 'yyyy') : null],
      length: data && data.length ? data.length : null,
      lengthUnit: ['1'],
      width: data && data.width ? data.width : null,
      widthUnit: ['1'],
      height: [data && data.height ? data.height : null],
      heightUnit: ['1'],
      depth: [data && data.depth ? data.depth : null],
      depthUnit: ['1'],
      weight: [data && data.weight ? data.weight : null],
      weightUnit: ['1'],
      diameter: [data && data.diameter ? data.diameter : null],
      diameterUnit: ['1'],

      era: [data && data.era ? data.era.id : null],
      style: [data && data?.style ? data?.style.id : null],

      totalLength: [data && data.totalLength ? data.totalLength : null],
      totlLengthUnit: ['1'],
      totalWidth: [data && data.totalWidth ? data.totalWidth : null],
      totalWidthUnit: [1],
      totalHeight: [data && data.totalHeight ? data.totalHeight : null],
      totalHeightUnit: ['1'],
      descriptiveWords: [data && data.status.descriptiveWords ? this.strIntoObj : null],

      description: [data && data.status ? data.status.description : null],
      registrationSignature: [data && data.status ? data.status.registrationSignature : null],
      otherRegistrations: [data && data.status ? data.status.otherRegistrations : null],
      marking: [data && data.status ? data.status.marking : null],
    });
  }
  initDepositStatusForm(data?: any) {
    this.depositStatusForm = this.fb.group({
      depositDate: [data && data.depositDate ? this.datePipe.transform(data?.depositDate, 'yyyy-MM-dd') : null],
      stopNumber: [data?.stopNumber],
      depositor: [data?.depositor ? data.depositor?.id : ''],
    });
  }
  initPropertyStatusForm(data?: any) {
    this.propertyStatusForm = this.fb.group({
      entryMode: [data?.entryMode?.id],
      entryDate: [data && data.entryDate ? this.datePipe.transform(data?.entryDate, 'yyyy-MM-dd') : null],
      marking: [data?.marking],
      category: [data?.category?.id],
      registrationSignature: [data?.registrationSignature],
      descriptiveWords: [data?.descriptiveWords],
      insuranceValue: [data?.insuranceValue],
      insuranceValueDate: [
        data && data.insuranceValueDate ? this.datePipe.transform(data?.insuranceValueDate, 'yyyy-MM-dd') : null,
      ],
      otherRegistrations: [data?.otherRegistrations],
      description: [data?.description],
    });
  }

  initHyperLink() {
    this.linksForm = this.fb.group({
      hyperlinks: this.fb.array([]),
    });
  }
  initLinks(data?: any) {
    this.linkArtWorkForm = this.fb.group({
      parent: [data && data.parent ? data.parent : null],
    });
  }
  f1(e: any) {
    this.dynamic = e;
  }

  onEditMode() {
    if (this.descriptifForm) {
      this.initDescriptifForm(this.workArt);
      this.edit = true;
    }
  }
  formatData() {
    const keys = ['width', 'length', 'totalHeight', 'totalWidth', 'totalLength', 'depth', 'diameter'];
    const filteredKeys = keys.filter((value) => this.attributes.includes(value));
    filteredKeys.forEach((key: string) => {
      if (this.descriptifForm.get(key).value) {
        this.descriptifForm
          .get(key)
          .setValue(+this.descriptifForm.get(key).value * +this.descriptifForm.get(key.concat('Unit')).value);
      }
    });
  }

  onSave(parent?: any, deletePar?: boolean, addPar?: boolean) {
    this.editLink = true;
    this.btnLoading = '';
    this.formatData();

    const authorsId: any[] = [];
    this.descriptifForm.value.authors?.map((el: any) => {
      authorsId.push(el);
    });
    const materialId: any[] = [];
    this.descriptifForm.value.materialTechnique?.map((el: any) => {
      materialId.push(el);
    });
    let data: any;
    if (deletePar || addPar) {
      data = {
        field: this.workArt?.field?.id,
        denomination: this.workArt?.denomination?.id,
        parent: parent,
      };
    } else {
      if (this.addProperty) {
        this.propertyStatusForm.get('marking').setValue(this.descriptifForm.get('marking').value);
        this.propertyStatusForm
          .get('registrationSignature')
          .setValue(this.descriptifForm.get('registrationSignature').value);
        this.propertyStatusForm
          .get('descriptiveWords')
          .setValue(this.descriptifForm?.get('descriptiveWords')?.value?.join(', '));
        this.propertyStatusForm.get('description').setValue(this.descriptifForm.get('description').value);
      }

      data = {
        ...this.descriptifForm.value,
        field: this.descriptifForm.value.field.id,
        denomination: this.descriptifForm?.value?.denomination?.id,
        style: this.descriptifForm?.value?.style?.id,

        status: this.addProperty ? this.propertyStatusForm.value : this.depositStatusForm.value,
        creationDate: this.descriptifForm.value.creationDate + '-01-01',
        parent: parent,
      };
    }

    this.workOfArtService.updateWorkOfArt(data, this.artWorkId).subscribe(
      (result) => {
        this.getArtWork(this.artWorkId);
        if (deletePar) {
          this.addSingle('success', 'Suppression', 'Lien avec oeuvres supprimé avec succée');
        } else if (addPar) {
          this.addSingle('success', 'Ajout', 'Lien avec oeuvres ajouté avec succée');
        } else {
          this.addSingle('success', 'Modification', 'Notice modifiée avec succée');
        }
        this.edit = false;
        this.editLink = false;
        this.btnLoading = null;
      },
      (error) => {
        this.btnLoading = null;
        this.workOfArtService.getFormErrors(error.error.errors, 'Modification');
      }
    );
  }

  showImg() {
    this.openImg = !this.openImg;
  }

  src(event: any) {
    this.imgSrc = event;
  }

  downloadPDF() {
    this.artWorksToPrint = [];
    this.artWorksToPrint.push(this.artwork);
    const element = document.getElementById('appItemDetailsPdf');
    this.pdfGeneratorService.downloadPDFFromHTML(element, this.artwork.titre + '.pdf');
  }

  initSearchPageParam() {
    const newParams = JSON.parse(localStorage.getItem(searchPageFilter));

    this.searchPageParam = {
      mode: newParams?.mode,
      filter: newParams.filter,
      advancedFilter: newParams.advancedFilter,
      headerFilters: newParams.headerFilters,
      page: newParams.page,
      limit: newParams.limit,
      sortBy: newParams.sortBy,
      sort: newParams.sort,
      globalSearch: newParams.globalSearch,
      searchQuery: newParams.searchQuery,
      totalFiltered: newParams.totalFiltered,
    };
  }

  saveArtOfWorkIndex(index: number) {
    localStorage.setItem(lastArtOfWorkDetailIndex, JSON.stringify(index));
  }

  paginate(click: boolean = false, by?: number, to?: any) {
    if (by) {
      this.page = this.page + by;
    }
    if (this.page < 0) {
      this.page = 0;
    }
    this.saveArtOfWorkIndex(this.page);
    if (click) {
      window.location.reload();
    }
    const urlParams = {
      offset: this.page,
      limit: 1,
      sort_by: this.searchPageParam.sortBy,
      sort: this.searchPageParam.sort,
      searchQuery: this.searchPageParam.searchQuery,
      globalSearch: this.searchPageParam.globalSearch,
      serializer_group: JSON.stringify(['response', 'art_work_details', 'short']),
    };
    this.loadingData = true;
    this.artWorkService
      .getArtWorksDetail(
        this.searchPageParam.filter,
        this.searchPageParam.advancedFilter,
        this.searchPageParam.headerFilters,
        urlParams
      )
      .subscribe(
        (result: any) => {
          const apiResult = result.result;
          this.artWorkId = apiResult.id;
          this.previousId = result.previousId;
          this.nextId = result.nextId;
          this.setArtwork(apiResult);
          this.loadingData = false;
        },
        (error: any) => {
          this.loadingData = false;
          console.log(error);
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }

  setPage() {
    const index = JSON.parse(localStorage.getItem(lastArtOfWorkDetailIndex));
    this.page = index;
    if (this.searchPageParam.mode !== 'pictures') {
      // when datatable display mode is selected in search page
      this.page = this.searchPageParam.limit * (this.searchPageParam.page - 1) + index;
      if (this.page < 0) {
        // it could be : if new page is lower than 0 then get the first element
        this.page = 0;
      }
    }
  }

  getArtWork(id: any) {
    this.workOfArtService
      .getWorkOfArtById(id, { serializer_group: JSON.stringify(['art_work_details', 'short']) })
      .subscribe(
        (result) => {
          this.setArtwork(result.artwork);
        },
        (error) => {
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }

  setPhotographies(data?:any){
    let noPrincipalPhoto=data.principalPhoto?data.photographies.filter((el:any)=>
         el.id !== data.principalPhoto.id
      ):data.photographies;
    noPrincipalPhoto.map((el: any, index: number) => {
      this.photographies.push({
        workArtId: data.id,
        id: el.id,
        imageUrl: el.imagePreview,
        imagePreview: el.imagePreview,
        alt: 'description',
        i: index,
        image: el.imageName,
        date: this.datePipe.transform(el.date, dateTimeFormat),
        photographyDate: this.datePipe.transform(el.date, dateTimeFormat),
        photographyName: el.imageName,
        photographyType: el.photographyType,
        imageName: el.imageName,
      });
    });
    if(data.principalPhoto) {
      this.photographies.unshift(data.principalPhoto);
    }
  }
  setArtwork(apiResult: any) {
    this.photographies = [];

    this.workArt = apiResult;
    this.artwork.titre = apiResult.title;
    this.artwork.authors = apiResult.authorsName;
    this.initDescriptifForm(apiResult);
    this.setPhotographies(apiResult);


    apiResult.status.statusType === 'PropertyStatus' ? (this.addProperty = true) : (this.addDepot = true);
    this.status = apiResult.status;
    this.addProperty ? this.initPropertyStatusForm(apiResult.status) : this.initDepositStatusForm(apiResult.status);
    this.attachments = apiResult.attachments;
    this.hyperLinkData = apiResult.hyperlinks;
    this.parent = apiResult.parent;
    this.children = apiResult.children;
    if (apiResult.parent) {
      this.initLinks(apiResult.parent);
    }
    if(apiResult.isCreated!==this.draftArtWork && !apiResult.isCreated){
      this.addSingle('success', '', 'Notice en mode brouillon')
    }
    this.draftArtWork=apiResult.isCreated;
    console.log(this.draftArtWork)
    if (apiResult && apiResult.status && apiResult.status.descriptiveWords) {
      let str: string = apiResult.status.descriptiveWords;
      let strIntoOb = str.split(',');
      this.strIntoObj = [];
      strIntoOb.forEach((value: any) => {
        this.strIntoObj.push(value);
      });
    }
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }

  getAttributes($event: any) {
    this.attributes = $event;
  }

  onCancel() {
    this.edit = false;
    this.initDescriptifForm(this.workArt);
  }
}

export interface ParentComponentApi {
  callParentMethod: (string?: any) => void;
}
