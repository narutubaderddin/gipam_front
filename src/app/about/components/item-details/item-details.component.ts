import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';
import {ActivatedRoute} from '@angular/router';
import {WorkOfArtService} from '@shared/services/work-of-art.service';
import {MessageService} from 'primeng/api';
import {dateTimeFormat} from '@shared/utils/helpers';
import {DatePipe} from '@angular/common';

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

  elementPosition: any = 2;
  workArt:{
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
  }
  type = 'depot';
  page: any = 5;
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

  artwork =
  {
    id: 145,
    titre: 'Titre',
    domain: 'Art graphique',
    field: 'Art graphique',
    height: '85',
    width: '85',
    authors: 'Auteur 1, Auteur 11',
    totalWidth:'',
    totalHeight:'',
    era:'',
    materialTechnique:'',
    status:'',
    denomination:'Affiche',
    createdAt:'22/01/2020'
  };
  artWorksToPrint: any = [];

  constructor(
    config: NgbCarouselConfig,
    private notificationsService: NotificationsService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private pdfGeneratorService: PdfGeneratorService,
    private route: ActivatedRoute,
    private workOfArtService: WorkOfArtService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.initDescriptifForm();
    this.initDepositStatusForm();
    this.initPhotographiesForm();
    this.initAttachmentForm();
    this.initPropertyStatusForm();
    this.initDepositStatusForm();
    this.initHyperLink();
    this.initLinks();
    this.getArtWork(id);
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
  initPropertyStatusForm() {
    this.propertyStatusForm = this.fb.group({
      entryMode: [''],
      entryDate: [''],
      marking: [''],
      category: [''],
      registrationSignature: [''],
      descriptiveWords: [''],
      insuranceValue: [''],
      insuranceValueDate: [''],
      otherRegistrations: [''],
      description: [''],
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
  onSave() {
    this.notificationsService.success('Succès', 'l\'Oeuvre "n° inventaire" a été mise à jour avec succès');
    this.edit = false;
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
  getArtWork(id:any){
    console.log('id', id)
    this.workOfArtService.getWorkOfArtById(id).subscribe(
      result=>{
        this.workArt= result;
        result.photographies.map((el:any, index:number)=>{
          this.photographies.push({
            imageUrl: el.imagePreview,
            alt: 'description',
            i: index,
            image: el.imageName,
            // photography: 'assets/images/573.jpg',
            photographyDate: this.datePipe.transform(el.date, dateTimeFormat),
            photographyName: el.imageName,
            photographyType: { name: el.photographyType.type },
            imageName: el.imageName,
          })
        });
        console.log(this.workArt);
      },
      error => {
        console.log(error);
        this.addSingle('error', 'Erreur Technique', error.error.message);
      }
    )
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }

}
