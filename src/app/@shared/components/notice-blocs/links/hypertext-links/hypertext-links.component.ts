import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-hypertext-links',
  templateUrl: './hypertext-links.component.html',
  styleUrls: ['./hypertext-links.component.scss'],
})
export class HypertextLinksComponent implements OnInit {
  @Input() add: false;
  myForm: FormGroup;

  get liens(): FormArray {
    return this.myForm.get('liens') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.configForm();
  }

  addBook() {
    this.liens.push(this.buildBook());
  }

  removeBook(i: number) {
    this.liens.removeAt(i);
  }

  save() {
    alert(`New Author created: ${this.myForm.get('author').value}`);
  }

  private configForm() {
    this.myForm = this.fb.group({
      author: ['', [Validators.required, Validators.maxLength(40)]],
      liens: this.fb.array([this.buildBook()]),
    });
  }

  private buildBook(): FormGroup {
    return this.fb.group({
      urlName: ['', [Validators.required]],
      url: [''],
    });
  }
}
