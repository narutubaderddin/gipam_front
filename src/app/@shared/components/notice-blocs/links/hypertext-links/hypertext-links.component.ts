import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-hypertext-links',
  templateUrl: './hypertext-links.component.html',
  styleUrls: ['./hypertext-links.component.scss'],
})
export class HypertextLinksComponent implements OnInit {
  @Input() add: false;
  @Input() linksForm: FormGroup;
  get hyperlinks(): FormArray {
    return this.linksForm.get('hyperlinks') as FormArray;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  createAttachment(attachment?: any, attachmentType?: any): FormGroup {
    return this.fb.group({
      name: [attachment],
      url: [attachmentType],
    });
  }

  addBook() {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    this.hyperlinks.push(this.createAttachment());
  }

  removeBook(i: number) {
    this.hyperlinks.removeAt(i);
  }
}
