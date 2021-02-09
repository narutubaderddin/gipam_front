import { AlertModalComponent } from './../alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { WorkOfArtService } from '@shared/services/work-of-art.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  oeuvreToShow: any = [];
  dropdownSettings = {};
  selectedItems: any = [];
  selectedCategory: number;
  keyword = 'name';
  oeuvre = this.WorkOfArtService.oeuvres;
  styles = [
    { id: 1, style: 'Renaissance' },
    { id: 2, style: 'Moyen âge' },
    { id: 3, style: 'Tableau non classés' },
  ];
  mode = 'pictures';
  domains = this.WorkOfArtService.domaine;

  filters = [
    {
      name: 'Déposant',
      list: ['Mobilier National', 'CNAP - Centre National des Arts Plastiques', 'Vladimir Jankovic'],
    },
  ];
  openType = false;
  filter = false;
  constructor(private router: Router, private modalService: NgbModal, private WorkOfArtService: WorkOfArtService) {}

  ngOnInit() {
    this.oeuvreToShow = this.oeuvre;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'style',
      selectAllText: 'tout sélectionner',
      unSelectAllText: 'tout déselectionner',
      itemsShowLimit: 1,
      allowSearchFilter: false,
      searchPlaceholderText: 'Chercher',
      clearSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    this.oeuvreToShow = [];
    this.selectedItems.forEach((value: any) => {
      this.oeuvre.forEach((oeuvre) => {
        if (value.style === oeuvre.style) {
          this.oeuvreToShow.push(oeuvre);
        }
      });
    });
  }
  onSelectAll() {
    this.oeuvreToShow = this.oeuvre;
  }
  onDeselectAll() {
    this.oeuvreToShow = this.oeuvre;
  }
  openTypes() {
    if (!this.openType) {
      return (this.openType = true);
    }
    return (this.openType = false);
  }
  changeMode() {
    this.mode = 'pictures';
  }
  changeMode1() {
    this.mode = 'liste';
  }
  openFilter() {
    if (!this.filter) {
      return (this.filter = true);
    }
    return (this.filter = false);
  }

  search(event: any) {
    if (event.target.value.length > 0) {
      this.oeuvreToShow = this.oeuvre.filter((x) => x.titre.toUpperCase().includes(event.target.value.toUpperCase()));
    } else {
      this.oeuvreToShow = this.oeuvre;
    }
  }
  details() {
    this.router.navigate(['item-details']);
  }
  onChangeEditor(deviceValue: any) {
    this.oeuvreToShow = this.oeuvre.filter((oeuvre: any) => {
      return oeuvre.editeur === deviceValue;
    });
    if (this.oeuvreToShow.length === 0) {
      this.oeuvreToShow = this.oeuvre;
    }
  }
  onChangeUnits(deviceValue: any) {
    this.oeuvreToShow = this.oeuvre.filter((oeuvre: any) => {
      return oeuvre.unit === deviceValue;
    });
    if (this.oeuvreToShow.length === 0) {
      this.oeuvreToShow = this.oeuvre;
    }
  }
  onChangeDate(deviceValue: any) {
    this.oeuvreToShow = this.oeuvre.filter((oeuvre: any) => {
      return oeuvre.anneeCreation === deviceValue;
    });
    if (this.oeuvreToShow.length === 0) {
      this.oeuvreToShow = this.oeuvre;
    }
  }
  onChangeMatiere(deviceValue: any) {
    this.oeuvreToShow = this.oeuvre.filter((oeuvre: any) => {
      return oeuvre.matiere === deviceValue;
    });
    if (this.oeuvreToShow.length === 0) {
      this.oeuvreToShow = this.oeuvre;
    }
  }
  onChangeDimension(deviceValue: any) {
    this.oeuvreToShow = this.oeuvre.filter((oeuvre: any) => {
      return oeuvre.dimension === deviceValue;
    });
    if (this.oeuvreToShow.length === 0) {
      this.oeuvreToShow = this.oeuvre;
    }
  }

  selectCategory(n: number) {
    this.selectedCategory = n;
  }

  onDeselect(event: any) {}

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  addOeuvre() {}

  openAlertModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    this.modalService.open(AlertModalComponent, ngbModalOptions);
  }
}
