import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  elementPosition: any;
  // @Input() collapseSideNav: boolean;

  type: string = 'depot';
  page: any = 2;
  edit = false;
  depositStatusForm: FormGroup;
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  // isCollapsed: boolean = false;
  dynamic: boolean = false;
  openImg: boolean = false;
  sticky: boolean = false;
  artwork = {
    id: 145,
    title: 'Titre de la sculpture',
    domain: 'Sculpture',
    height: '100cm',
    width: '100cm',
    author: 'Auteur 1, Auteur 11',
  };

  get menuClosed(): boolean {
    // console.log('menuOpened', this.sharedService.collapseMenu);

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
    this.menuClosed;
    this.initDepositStatusForm();
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
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
  page1() {
    this.page = 1;
  }
  page2() {
    this.page = 2;
  }
  page3() {
    this.page = 3;
  }
  page4() {
    this.page = 4;
  }
  page5() {
    this.page = 5;
  }
  page6() {
    this.page = 6;
  }
  page7() {
    this.page = 7;
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

  downloadPDF() {
    const element = document.getElementById('appItemDetailsPdf');
    this.pdfGeneratorService.downloadPDFFromHTML(element, this.artwork.title + '.pdf');
  }
}
