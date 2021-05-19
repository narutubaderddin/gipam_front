import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-hypertext-links',
  templateUrl: './hypertext-links.component.html',
  styleUrls: ['./hypertext-links.component.scss'],
})
export class HypertextLinksComponent implements OnInit, OnChanges {
  @Input() add: false;
  @Input() linksForm: FormGroup;
  @Input() existingLinks: any[]=[];
  @Input() itemDetails = false;
  myForm: FormGroup;
  addLinks: boolean = false;
  deleteDialog: boolean = false;
  itemToDelete: string = '';
  selectedItem: any;
  // existingLinks: any[] = [
  //   {
  //     url: 'string',
  //     name: 'string',
  //   },
  // ];
  get hyperlinks(): FormArray {
    return this.linksForm.get('hyperlinks') as FormArray;
  }
  get liens(): FormArray {
    return this.myForm.get('liens') as FormArray;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.configForm();
    console.log("liens", this.existingLinks)
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.existingLinks)
  }

  createAttachment(attachment?: any, attachmentType?: any): FormGroup {
    return this.fb.group({
      name: [attachment],
      url: [attachmentType],
    });
  }

  addBook() {
    this.hyperlinks.push(this.createAttachment());
  }

  removeBook(i: number) {
    this.hyperlinks.removeAt(i);
  }
  addLink() {
    this.liens.push(this.buildLink());
  }

  removeLink(i: number) {
    this.liens.removeAt(i);
  }

  save() {
    alert(`New Author created: ${this.myForm.get('author').value}`);
  }

  configForm() {
    this.myForm = this.fb.group({
      liens: this.fb.array([this.buildLink()]),
    });
  }

  buildLink(): FormGroup {
    return this.fb.group({
      urlName: ['', [Validators.required]],
      url: ['', [Validators.required]],
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
