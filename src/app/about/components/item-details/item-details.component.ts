import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  @ViewChild('accordionDOM') public parentRef: ElementRef<HTMLElement>;
  @ViewChild('stickyMenu') menuElement: ElementRef;

  elementPosition: any = 2;
  // @Input() collapseSideNav: boolean;

  type: string = 'depot';
  page: any = 5;
  edit = false;
  depositStatusForm: FormGroup;
  descriptifForm: FormGroup;
  attachmentForm:FormGroup;
  photographies: any[] = [
    // get images of item
    {
      imageUrl: 'assets/images/573.jpg',
      alt: 'description',
      i: 0,
      image: 'palette 1.jpg',
      photography: 'assets/images/573.jpg',
      photographyDate: '12/2/2020',
      photographyName: 'profil.jpg',
      photographyType: { name: 'Etat' },
      imageName: 'imageName',
    },
    {
      imageUrl: 'assets/images/365.jpg',
      alt: 'description',
      i: 1,
      image: 'palette 2.jpg',
      photography: 'assets/images/365.jpg',
      photographyDate: '12/2/2020',
      photographyName: 'profil.jpg',
      photographyType: { name: 'Identification' },
      imageName: 'imageName12',
    },
  ];
  imgSrc: string = this.photographies[0] ? this.photographies[0].imageUrl : '';
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  // isCollapsed: boolean = false;
  dynamic: boolean = false;
  openImg: boolean = false;
  sticky: boolean = false;

  photographiesForm: FormGroup;

  artwork = {
    id: 145,
    title: 'Titre de la sculpture',
    domain: 'Sculpture',
    height: '100cm',
    width: '100cm',
    author: 'Auteur 1, Auteur 11',
  };

  get menuClosed(): boolean {
    return this.sharedService.collapseMenu;
  }

  constructor(
    config: NgbCarouselConfig,
    private notificationsService: NotificationsService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private pdfGeneratorService: PdfGeneratorService
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
  ngOnInit() {
    this.initDescriptifForm();
    this.initDepositStatusForm();
    this.initPhotographiesForm();
    this.initAttachmentForm()
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
  initDescriptifForm() {
    this.descriptifForm = this.fb.group({
      title: ['', Validators.required],
      field: ['', Validators.required],
      denomination: ['', Validators.required],
      materialTechnique: ['', Validators.required],
      numberOfUnit: ['', Validators.required],
      authors: [],
      creationDate: [],
      length: [],
      width: [],
      height: [],
      depth: [],
      weight: [],
      diameter: [],
      era: [],
      style: [],
      totalLength: [],
      totalWidth: [],
      totalHeight: [],
      descriptiveWords: [],
      items: [],
    });
  }
  initDepositStatusForm() {
    this.depositStatusForm = this.fb.group({
      depositDate: [''],
      stopNumber: [''],
    });
  }
  f1(e: any) {
    this.dynamic = e;
    console.log(this.dynamic);
  }

  onEditMode() {
    this.edit = !this.edit;
  }
  onSave() {
    this.notificationsService.success('Succès', 'l\'Oeuvre "n° inventaire" a été mise à jour avec succès');
    this.edit = false;
  }

  showImg() {
    this.openImg = !this.openImg;
    // console.log(this.openImg);
  }

  src(event: any) {
    this.imgSrc = event;
    console.log(event);
  }

  downloadPDF() {
    const element = document.getElementById('appItemDetailsPdf');
    this.pdfGeneratorService.downloadPDFFromHTML(element, this.artwork.title + '.pdf');
  }
}
