import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { WorkOfArtService } from '@shared/services/work-of-art.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @ViewChild('autocompletePanel') autocompletePanel: any;
  @Input() add: false;
  @Input() itemDetails: boolean= false;

  addLinks:boolean=false;
  artWorksData: any[] = [];
  page = 1;
  query = '';
  same = true;
  deleteDialog: boolean=false;
  itemToDelete:string='';
  selectedItem: any;
  existingLinks: any[]=[
    {
      url: "string",
      name: "string"
    }
  ];

  constructor(
    private artWorkService: ArtWorkService,
    private workOfArtService: WorkOfArtService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

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
      this.artWorksData = this.artWorksData.concat(response.results);
    });
  }

  search(event: any) {
    console.log('eee', event);
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

  addNewLinks() {
    this.addLinks=!this.addLinks;
  }
  addLink(){
    this.existingLinks.push({
      // i: this.photographyInsertionNumber,
      url: "string",
      name: "string"
    });
  }
  cancelLink(){
    this.addLinks=!this.addLinks;
  }
  delete(item:string){
    this.deleteDialog=true;
    this.itemToDelete= item['name'];
    this.selectedItem= item;
  }
  cancelDelete(){
    this.deleteDialog=false;
    this.itemToDelete= '';
  }
  removeLink(i: number) {
    this.existingLinks.splice(i,1);
    this.deleteDialog=false;
  }
  getIndex(el:any) {
    return this.existingLinks.indexOf(el);
  }
}
