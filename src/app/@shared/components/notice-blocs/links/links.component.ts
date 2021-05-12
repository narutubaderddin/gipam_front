import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @ViewChild('autocompletePanel') autocompletePanel: any;
  @Input() linkArtWorkForm: FormGroup;
  @Input() add: false;
  artWorksData: any[] = [];
  page = 1;
  query = '';
  private same = true;

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
    console.log(this.linkArtWorkForm);
  }
}
