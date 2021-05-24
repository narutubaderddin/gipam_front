import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ParentComponentApi} from '@app/about/components/item-details/item-details.component';
import {LinksService} from "@shared/services/links.service";
import {MessageService} from "primeng/api";
@Component({
  selector: 'app-hypertext-links',
  templateUrl: './hypertext-links.component.html',
  styleUrls: ['./hypertext-links.component.scss'],
})
export class HypertextLinksComponent implements OnInit, OnChanges {
  @Input() add: false;
  @Input() linksForm: FormGroup;
  @Input() existingLinks: any[] = [];
  @Input() itemDetails = false;
  @Input() artwork: any;
  @Input() parentApi: ParentComponentApi;

  addLinks: boolean = false;
  deleteDialog: boolean = false;
  itemToDelete: string = '';
  selectedItem: any;
  btnLoading: any = null;
  get hyperlinks(): FormArray {
    return this.linksForm.get('hyperlinks') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private linksService: LinksService,
              private messageService: MessageService) {}

  ngOnInit() {
    if (this.existingLinks.length) {
      this.existingLinks.map((el: any) => {
        this.hyperlinks.push(this.createHyperLink(el.name, el.url));
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {}

  createHyperLink(name?: any, url?: any): FormGroup {
    return this.fb.group({
      name: [name],
      url: [url, this.itemDetails?Validators.required:''],
    });
  }

  addHyperlink() {
    this.hyperlinks.push(this.createHyperLink());
   // console.log(this.hyperlinks.get('url'), this.hyperlinks.get('url').errors.required)
  }

  removeHyperLinks(i: number) {
    this.hyperlinks.removeAt(i);
  }

  removeLink(i: number) {
    this.hyperlinks.removeAt(i);
    this.btnLoading = '';
    this.linksService.deleteLinks({furniture:this.artwork.id},this.selectedItem.id).subscribe(
      result=>{
        this.callParent();

        this.addSingle('success', 'Suppresion', 'Lien hypertexte supprimée avec succés');
        this.btnLoading = null;
        this.deleteDialog = false;
      },
      error=>{
        console.log(error)
        this.addSingle('error', 'Suppresion', error.error.message);
        this.btnLoading = null;
      }
    )
  }


  addNewLinks() {
    this.addLinks = true;
    this.addHyperlink()
  }
  cancelAddLinks() {
    this.addLinks = false;
    this.hyperlinks.clear();
  }
  getIndex(el: any) {
    return this.existingLinks.indexOf(el);
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
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }
  callParent() {
    this.parentApi.callParentMethod(this.artwork.id);
  }

  addHyperLinks() {
    this.hyperlinks.value.map((el:any, i:any)=>{
      Object.assign(el, {furniture: this.artwork.id})
      let data = el;
      this.btnLoading = '';
      this.linksService.AddLinks(data).subscribe(
        result=>{
          this.callParent();
          this.addSingle('success', 'Ajout', 'Lien hypertexte ajouté(s) avec succés');
          this.btnLoading = null;
          this.addLinks=false;
          this.hyperlinks.clear();
        },
        error=>{
          console.log(error)
          this.addSingle('error', 'Ajout', "une erreur est servenu lors de l'ajout");
          this.btnLoading = null;
        }
      )
    })
  }
}
