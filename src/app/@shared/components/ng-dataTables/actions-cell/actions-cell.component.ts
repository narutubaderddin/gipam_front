import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-actions-cell',
  templateUrl: './actions-cell.component.html',
  styleUrls: ['./actions-cell.component.scss'],
})
export class ActionsCellComponent implements OnInit {
  @Input() value: any;
  @Input() component: string;
  @Output() methodToEmit: EventEmitter<any> = new EventEmitter();

  visible = true;
  active = true;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.value);
    this.active = this.value.active;
  }

  modalEdit() {
    this.methodToEmit.emit({ method: 'edit', item: this.value });
  }

  ChangeVisibility(e: any) {
    this.methodToEmit.emit({ method: 'visibility', item: this.value });
  }
  delete() {
    this.methodToEmit.emit({ method: 'delete', item: this.value });
  }
}
