import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { MessageService } from 'primeng/api';
import { dateTimeFormat, lastArtOfWorkDetailIndex, searchPageFilter } from '@shared/utils/helpers';
import { DatePipe } from '@angular/common';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { Util } from 'leaflet';
import formatNum = Util.formatNum;

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
    field: 'Art graphique';
    height: '85';
    width: '85';
    authors: 'Auteur 1, Auteur 11';
    totalWidth: '';
    totalHeight: '';
    era: '';
    materialTechnique: '';
    status: '';
    denomination: 'Affiche';
    createdAt: '22/01/2020';
  };
  editLink: boolean = true;
  parent: any = '';
  children: any = [];
  hypertextLinks: any[] = [];
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
  nextId: string;
  previousId: string;
  paginationIndexes: {
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
    // this.initDescriptifForm();
    // this.currentId = this.route.snapshot.paramMap.get('id');
    this.initSearchPageParam();
    this.initDepositStatusForm();
    this.initPhotographiesForm();
    this.initAttachmentForm();
    this.initPropertyStatusForm();
    this.initDepositStatusForm();
    this.initHyperLink();
    this.initLinks();
    this.getArtWork(this.artWorkId);
    this.initPagination();
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
      callParentMethod: () => {
        console.log('linksForm', this.linksForm.value);
        // this.onSave()
      },
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
  initDescriptifForm(data?: any) {
    let materialTechnique: any[] = [];
    data?.materialTechnique.map((el: any) => {
      materialTechnique.push({ id: el.id, name: el.label });
    });

    this.descriptifForm = this.fb.group({
      title: [data?.title, Validators.required],
      field: [{ id: data?.field.id, name: data?.field.label }, Validators.required],
      denomination: [data?.denomination, Validators.required],
      materialTechnique: [materialTechnique, Validators.required],
      numberOfUnit: [data?.numberOfUnit, Validators.required],
      authors: [data.authors ? data.authors : []],
      creationDate: [new Date(data?.creationDate)],
      length: [data?.length],
      width: [data?.width],
      height: [data?.height],
      depth: [data?.depth],
      weight: [data?.weight],
      diameter: [data?.diameter],
      era: [data?.era],
      style: [data?.style],
      totalLength: [data?.totalLength],
      totalWidth: [data?.totalWidth],
      totalHeight: [data?.totalHeight],
      descriptiveWords: [data?.descriptiveWords],
      items: [data?.items],
    });
  }
  initDepositStatusForm(data?: any) {
    this.depositStatusForm = this.fb.group({
      depositDate: [data?.depositDate],
      stopNumber: [data?.stopNumber],
    });
  }
  initPropertyStatusForm(data?: any) {
    this.propertyStatusForm = this.fb.group({
      entryMode: [data?.entryMode],
      entryDate: [data?.entryDate],
      marking: [data?.marking],
      category: [data?.category],
      registrationSignature: [data?.registrationSignature],
      descriptiveWords: [data?.descriptiveWords],
      insuranceValue: [data?.insuranceValue],
      insuranceValueDate: [data?.insuranceValueDate],
      otherRegistrations: [data?.otherRegistrations],
      description: [data?.description],
    });
  }

  initHyperLink() {
    this.linksForm = this.fb.group({
      hyperlinks: this.fb.array([]),
    });
  }
  initLinks() {
    this.linkArtWorkForm = this.fb.group({
      parent: [''],
    });
  }
  f1(e: any) {
    this.dynamic = e;
  }

  onEditMode() {
    this.edit = !this.edit;
  }
  formatData() {
    const keys = ['width', 'length', 'totalHeight', 'totalWidth', 'totalLength', 'depth', 'diameter'];
    const filteredKeys = keys.filter((value) => this.attributes.includes(value));
    filteredKeys.forEach((key: string) => {
      if (this.descriptifForm.get(key).value) {
        this.descriptifForm.get(key).setValue(+this.descriptifForm.get(key).value);
      }
    });
  }
  onSave(parent?: any) {
    this.editLink = true;
    this.btnLoading = '';
    this.formatData();

    const authorsId: any[] = [];
    this.descriptifForm.value.authors?.map((el: any) => {
      authorsId.push(el.id);
    });
    const materialId: any[] = [];
    this.descriptifForm.value.materialTechnique?.map((el: any) => {
      materialId.push(el.id);
    });
    const data = {
      ...this.descriptifForm.value,
      field: this.descriptifForm.value.field.id,
      denomination: this.descriptifForm.value.denomination.id,
      authors: authorsId,
      materialTechnique: materialId,
      status: this.addProperty ? this.propertyStatusForm.value : this.depositStatusForm.value,
      parent: parent,
    };

    this.workOfArtService.updateWorkOfArt(data, this.artWorkId).subscribe(
      (result) => {
        this.getArtWork(this.artWorkId);
        this.addSingle('success', 'Modification', 'Notice modifiée avec succée');
        this.edit = false;
        this.editLink = false;
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
    this.artWorksToPrint.push(this.artwork);
    const element = document.getElementById('appItemDetailsPdf');
    this.pdfGeneratorService.downloadPDFFromHTML(element, this.artwork.titre + '.pdf');
  }
  initSearchPageParam() {
    const newParams = JSON.parse(localStorage.getItem(searchPageFilter));

    this.searchPageParam = {
      mode: newParams.mode,
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

  paginate(by: number) {
    this.page = this.page + by;

    this.artWorkService
      .getArtWorksData(
        this.searchPageParam.filter,
        this.searchPageParam.advancedFilter,
        this.searchPageParam.headerFilters,
        this.page,
        1,
        this.searchPageParam.sortBy,
        this.searchPageParam.sort,
        this.searchPageParam.globalSearch,
        this.searchPageParam.searchQuery
      )
      .subscribe(
        (result) => {
          this.currentId = result.results[0].id;
          console.log('new artWork id', this.currentId);
          this.router.navigate(['/details/' + this.currentId]);
          this.getArtWork(this.currentId);
          // this.workArt = result.results[0];
          // console.log('paginate', this.workArt)
          // result.photographies.map((el: any, index: number) => {
          //   this.photographies.push({
          //     imageUrl: el.imagePreview,
          //     alt: 'description',
          //     i: index,
          //     image: el.imageName,
          //     // photography: 'assets/images/573.jpg',
          //     photographyDate: this.datePipe.transform(el.date, dateTimeFormat),
          //     photographyName: el.imageName,
          //     photographyType: { name: el.photographyType.type },
          //     imageName: el.imageName,
          //   });
          // });
          // result.status.statusType === 'PropertyStatus' ? (this.addProperty = true) : (this.addDepot = true);
          // this.status = result.status;
          // this.attachments = result.attachments;
          // this.hypertextLinks = result.hyperlinks;
          // this.parent = result.parent;
          // this.children = result.children;
        },
        (error) => {
          console.log(error);
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }

  inPage(index: number, pageLimit: number) {
    index = index % 5;
    return (index - 1) * (index - pageLimit) < 0;
  }

  setPage() {
    const index = JSON.parse(localStorage.getItem(lastArtOfWorkDetailIndex)) + 1;
    console.log('index', index);
    this.page = index;

    if (this.searchPageParam.mode !== 'pictures') {
      // when datatable display mode is selected in search page
      this.page = this.searchPageParam.limit * (this.searchPageParam.page - 1) + index;
      if (this.page <= 0) {
        // it could be : if new page is lower than or equal to 0 then get the first element
        this.page = 1;
      }
    }
    if (this.page === 1) {
      this.setPaginationIndexes(this.searchPageParam.totalFiltered, 'previous');
      return;
    }
    if (this.page === this.searchPageParam.totalFiltered) {
      this.setPaginationIndexes(1, 'next');
      return;
    }
    if (index === 0 && this.page > 1) {
      this.setPaginationIndexes(this.page - 1, 'previous');
      return;
    }
    if (index === this.searchPageParam.limit && this.page > 1) {
      this.setPaginationIndexes(this.page - 1, 'previous');
      return;
    }
  }

  setPaginationIndexes(page: number, index: string) {
    this.artWorkService
      .getArtWorksData(
        this.searchPageParam.filter,
        this.searchPageParam.advancedFilter,
        this.searchPageParam.headerFilters,
        this.searchPageParam.totalFiltered,
        1,
        this.searchPageParam.sortBy,
        this.searchPageParam.sort,
        this.searchPageParam.globalSearch,
        this.searchPageParam.searchQuery,
        JSON.stringify(['response', 'art_work_list', 'hyperLink_furniture', 'id', 'art_work_details'])
      )
      .subscribe(
        (result) => {
          this.paginationIndexes[index] = result.results[0].id;
        },
        (error) => {
          console.log(error);
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }

  initPagination() {
    /// new get
    const lastItemsIds = JSON.parse(localStorage.getItem('searchPageFilterLastItemsIds'));
    // const index = lastItemsIds.indexOf(Number(id)) + 1;
    this.setPage();
    this.artWorkService
      .getArtWorksData(
        this.searchPageParam.filter,
        this.searchPageParam.advancedFilter,
        this.searchPageParam.headerFilters,
        this.page,
        1,
        this.searchPageParam.sortBy,
        this.searchPageParam.sort,
        this.searchPageParam.globalSearch,
        this.searchPageParam.searchQuery,
        JSON.stringify(['response', 'art_work_list', 'hyperLink_furniture', 'id', 'art_work_details'])
      )
      .subscribe(
        (result) => {
          console.log('lastItemsIds', lastItemsIds);
          this.currentId = result.results[0].id;
          console.log('new artWork id', this.currentId);
        },
        (error) => {
          console.log(error);
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }

  getArtWork(id: any) {
    this.workOfArtService
      .getWorkOfArtById(id, { serializer_group: JSON.stringify(['art_work_details', 'short']) })
      .subscribe(
        (result) => {
          this.photographies = [];

          this.workArt = result;
          this.initDescriptifForm(result);
          result.photographies.map((el: any, index: number) => {
            this.photographies.push({
              workArtId: result.id,
              id: el.id,
              imageUrl: el.imagePreview,
              alt: 'description',
              i: index,
              image: el.imageName,
              photographyDate: this.datePipe.transform(el.date, dateTimeFormat),
              photographyName: el.imageName,
              photographyType: el.photographyType,
              imageName: el.imageName,
            });
          });
          result.status.statusType === 'PropertyStatus' ? (this.addProperty = true) : (this.addDepot = true);
          this.status = result.status;
          this.addProperty ? this.initDepositStatusForm(result.status) : this.initPropertyStatusForm(result.status);
          this.attachments = result.attachments;
          this.hypertextLinks = result.hyperlinks;
          this.parent = result.parent;
          this.children = result.children;
        },
        (error) => {
          this.addSingle('error', 'Erreur Technique', error.error.message);
        }
      );
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }

  getAttributes($event: any) {
    this.attributes = $event;
    console.log('attributes', this.attributes);
  }

  onCancel() {
    this.edit = false;
  }
}
export interface ParentComponentApi {
  callParentMethod: (string?: any) => void;
}
