import { Component, Input, OnInit } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() domains: any;
  @Input() keyword: string;
  @Input() edit = false;
  @Input() addProperty = false;
  @Input() addDeposit = false;
  @Input() propertyStatusForm: FormGroup;
  @Input() depositStatusForm: FormGroup;
  isCollapsed = false;
  categories = ['Bien patrimonial exceptionnel', 'Bien patrimonial standard', 'Bien usuel', 'issu du 1% artistique'];
  modeEntree = ["Inscription rétrospective à l'inventaire", 'Don', 'Acquisition', "Cession / transfert d'affectation"];
  constructor(public WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {}
  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
