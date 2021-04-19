import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.scss'],
})
export class NgDataTableComponent implements OnInit {
  @Input() columns: any[];
  @Input() frozenCols: any[];
  @Input() data: any[] = [];
  @Input() start: number = 1;
  @Input() end: number = 5;
  @Input() totalFiltred: number = 10;
  @Input() total: number = 10;
  @Input() checkBoxSelection: Boolean = false;
  @Input() frozenWidth: string = '250px';
  calendar_fr: any;

  rangeDates: Date[];
  selectedItems: any;

  selectedRows: any[];

  constructor() {}

  ngOnInit(): void {
    this.data = this.data.slice(0, 5);
    // this. calendar_fr = {
    //   closeText: 'Fermer',
    //   prevText: 'Précédent',
    //   nextText: 'Suivant',
    //   monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
    //   monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc' ],
    //   dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    //   dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    //   dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    //   weekHeader: 'Semaine',
    //   firstDay: 1,
    //   isRTL: false,
    //   showMonthAfterYear: false,
    //   yearSuffix:'',
    //   timeOnlyTitle: 'Choisir l\'heure',
    //   timeText: 'Heure',
    //   hourText: 'Heures',
    //   minuteText: 'Minutes',
    //   secondText: 'Secondes',
    //   currentText: 'Maintenant',
    //   ampm: false,
    //   month: 'Mois',
    //   week: 'Semaine',
    //   day: 'Jour',
    //   allDayText: 'Toute la journée'
    // };
  }

  onDataChange(event: any) {
    console.log(event);
  }

  loadData($event: any) {}

  filterHeader($event: Event) {
    // @ts-ignore
    console.log($event.target.value);
  }

  onRowSelect(event: any) {
    console.log(this.selectedRows);
  }

  onChange() {}
}
