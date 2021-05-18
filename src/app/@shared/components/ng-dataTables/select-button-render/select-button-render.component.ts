import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-button-render',
  templateUrl: './select-button-render.component.html',
  styleUrls: ['./select-button-render.component.scss'],
})
export class SelectButtonRenderComponent implements OnInit {
  @Input() value: string;
  @Input() disabled: boolean;
  @Output() selectedStatus = new EventEmitter();
  stateOptions: any[];
  constructor() {
  }

  ngOnInit(): void {
    this.stateOptions = [
      { label: 'Accepté', value: 'Accepté' },
      { label: 'Refusé', value: 'Refusé' },
    ];
  }
  changeArtWorkStatus($event:any){
    this.selectedStatus.emit($event.value);
  }
}
