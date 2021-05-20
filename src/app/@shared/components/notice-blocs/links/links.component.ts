import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit, OnChanges {
  @ViewChild('autocompletePanel') autocompletePanel: any;
  @Input() linkArtWorkForm: FormGroup;
  @Input() add: false;
  @Input() itemDetails: boolean = false;
  @Input() parentLink: any = '';
  @Input() children: any = '';
  @Input() existingLink: any;
  @Input() editWorkArtLinks: boolean;

  @Output() update = new EventEmitter<any>();
  addLinks: boolean = false;
  editLinks: boolean = false;
  artWorksData: any[] = [];
  page = 1;
  query = '';
  same = true;
  deleteDialog: boolean = false;
  itemToDelete: string = '';
  selectedItem: any;
  btnLoading: any = null;
  existingLinks: any[] = [
    {
      url: 'string',
      name: 'string',
    },
  ];
  link: any;
  constructor(
    private artWorkService: ArtWorkService,
    private workOfArtService: WorkOfArtService,
    private renderer: Renderer2,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}
  ngOnChanges() {
    if (!this.editWorkArtLinks) {
      this.editLinks = false;
    }
  }
  getWorkOfArts(pageNumber: number = 1, query: string = '') {
    const filter = {
      page: pageNumber,
      search: query,
    };
    this.workOfArtService.getOeuvres(filter).subscribe((response) => {
      if (!this.same) {
        this.page = 1;
        this.artWorksData = [];
      }
      response.results.forEach((item: any) => {
        item.data = item.id + '-' + item.title + '-' + item.field.label;
      });
      this.artWorksData = this.artWorksData.concat(response.results);
    });
  }

  search(event: any) {
    if (!event) {
      this.query = '';
      this.same = true;
    } else {
      this.same = event.query === this.query;
      this.query = event.query;
    }
    this.getWorkOfArts(this.page, this.query);
  }

  change() {
    setTimeout(() => {
      const autocompletePanel = this.autocompletePanel.el.nativeElement.querySelector('.p-autocomplete-panel');
      if (autocompletePanel) {
        this.renderer.listen(autocompletePanel, 'scroll', (event) => {
          if (event.target.scrollHeight - event.target.clientHeight === event.target.scrollTop) {
            this.page++;
            this.search(this.query);
          }
        });
      }
    }, 500);
  }
  handleSelect(item: any) {
    this.linkArtWorkForm.get('parent').setValue(item.id);
  }
  addNewLinks() {
    this.addLinks = !this.addLinks;
  }
  addLink() {
    this.existingLinks.push({
      url: 'string',
      name: 'string',
    });
  }
  cancelLink() {
    this.addLinks = !this.addLinks;
    this.editLinks = false;
  }
  delete(item: string) {
    this.deleteDialog = true;
    this.itemToDelete = item['name'];
    this.selectedItem = item;
  }
  cancelDelete() {
    this.deleteDialog = false;
    this.itemToDelete = '';
  }
  removeLink(i: number) {
    this.existingLinks.splice(i, 1);
    this.deleteDialog = false;
  }
  getIndex(el: any) {
    return this.existingLinks.indexOf(el);
  }
  editLink() {
    this.editLinks = !this.editLinks;
  }

  updateLink() {
    this.update.emit(this.linkArtWorkForm.value.parent);
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }
}
