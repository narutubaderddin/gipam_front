import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  myForm: FormGroup;
  addLinks: boolean = false;
  deleteDialog: boolean = false;
  itemToDelete: string = '';
  selectedItem: any;

  get hyperlinks(): FormArray {
    return this.linksForm.get('hyperlinks') as FormArray;
  }
  get liens(): FormArray {
    return this.myForm.get('liens') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.configForm();
  }
  ngOnChanges(changes: SimpleChanges) {}

  createHyperLink(name?: any, url?: any): FormGroup {
    return this.fb.group({
      name: [name],
      url: [url],
    });
  }

  addHyperlink() {
    this.hyperlinks.push(this.createHyperLink());
  }

  removeHyperLinks(i: number) {
    this.hyperlinks.removeAt(i);
  }

  addLink() {
    this.liens.push(this.createHyperLink());
  }

  removeLink(i: number) {
    this.liens.removeAt(i);
  }

  save() {
    alert(`New Author created: ${this.myForm.get('author').value}`);
  }

  configForm() {
    this.myForm = this.fb.group({
      liens: this.fb.array([this.createHyperLink()]),
    });
  }

  addNewLinks() {
    this.addLinks = true;
  }
  cancelAddLinks() {
    this.addLinks = false;
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
}
