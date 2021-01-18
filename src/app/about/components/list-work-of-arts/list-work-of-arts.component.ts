import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { ColDef, ColumnApi, GridApi, ICellEditorParams, Column, GridOptions } from 'ag-grid-community';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ColumnFilterService, OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnFilterModel } from '@shared/models/column-filter-model';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';

@Component({
  selector: 'app-list-work-of-arts',
  templateUrl: './list-work-of-arts.component.html',
  styleUrls: ['./list-work-of-arts.component.scss'],
})
export class ListWorkOfArtsComponent implements OnInit {
  mode = 'liste';
  filterFormGroup: FormGroup;
  columnDropped = new EventEmitter();
  columnDroppedSubscription: Subscription;
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: GridActionRendererComponent,
  };
  defaultColDef = {
    headerClass: 'header-cell',
    headerComponent: 'customHeader',
    sortable: true,
    filter: true,
    resizable: true,
    headerValueGetter: (params: any) => {
      return params.colDef.headerName;
    },
    headerComponentParams: {
      menuIcon: 'fa-filter',
      operator: OPERATORS.like,
      type: TYPES.text,
    },
  };
  gridOptions: GridOptions = {
    suppressLoadingOverlay: false,
    suppressScrollOnNewData: true,
    onDragStopped: () => {
      this.columnDropped.next();
    },
    onColumnMoved: (_) => {
      if (this.columnDroppedSubscription) {
        this.columnDroppedSubscription.unsubscribe();
      }
      this.columnDroppedSubscription = this.columnDropped.pipe(first()).subscribe(() => {
        this.updateColumnsConfiguration();
      });
    },
  };
  oeuvres = [
    {
      id: 0,
      titre: 'Vénus de Milo',
      auteur: 'auteur',
      description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
      mots_descriptifs: 'mots_descriptifs',
      commentaire: 'commentaire',
      image: 'assets/images/573.jpg',
      vip: 'true',
      domaine: 'Sculpture',
      editeur: "Alexandros d'Antioche",
      anneeCreation: 1820,
      dimension: '202x36x64',
      matiere: 'Marbre',
      style: 'Tableau non classés',
      creationDate: '12/07/1985',
      property: 'Propriété',
    },
    {
      id: 1,
      titre: 'La Joconde',
      description: 'Le Portrait de Mona Lisa est celui de la Florentine Lisa Gherardini',
      image: 'assets/images/1.jpg',
      vip: 'true',
      status: 'notRecieved',
      domaine: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1519,
      dimension: '77 × 53 cm',
      style: 'Renaissance',
      matiere: 'Huile sur panneau de bois',
      creationDate: '15/02/1975',
      property: 'Propriété',
    },
    {
      id: 2,
      titre: 'La Belle Ferronnière',
      description: 'Un tableau peint sur un panneau en bois de noyer',
      image: 'assets/images/2.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1497,
      dimension: '62 × 44 cm',
      style: 'Renaissance',
      matiere: 'Huile sur panneau de bois',
      creationDate: '30/11/1920',
      property: 'Propriété',
    },
    {
      id: 3,
      titre: 'La Liberté guidant le peuple',
      description: "Une huile sur toile d'Eugène Delacroix  ",
      image: 'assets/images/4.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Sculpture',
      editeur: 'Eugène Delacroix',
      anneeCreation: 1830,
      dimension: '260 × 325 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
      creationDate: '25/12/1921',
      property: 'Dépôt',
    },
    {
      id: 4,
      titre: 'ECOLE FRANCAISE VERS 1830,D’APRÈS PIERRE...',
      description: 'ECOLE FRANCAISE VERS 1830, D’APRÈS PIERRE...',
      image: 'assets/images/25.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Peinture',
      editeur: '',
      anneeCreation: '',
      dimension: '77 × 53 cm',
      style: 'Tableau non classés',
      creationDate: '24/10/1919',
      property: 'Propriété',
    },
    {
      id: 5,
      titre: 'Victoire de Samothrace',
      description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
      image: 'assets/images/35.jpg',
      vip: 'false',
      status: 'notRecieved',
      domaine: 'Sculpture',
      anneeCreation: 1863,
      dimension: '77 × 53 cm',
      matiere: 'Marbre',
      style: 'Tableau non classés',
      creationDate: '30/11/1920',
      property: 'Dépôt',
    },
    {
      id: 6,
      titre: "L'Esclave mourant",
      auteur: 'auteur',
      description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
      mots_descriptifs: 'mots_descriptifs',
      commentaire: 'commentaire',
      image: 'assets/images/162.JPG',
      vip: 'true',
      domaine: 'Sculpture',
      editeur: 'Michel-Ange',
      anneeCreation: 1820,
      dimension: '202x36x64',
      matiere: 'Marbre',
      style: 'Tableau non classés',
      creationDate: '27/09/1914',
      property: 'Propriété',
    },

    {
      id: 7,
      titre: 'La Vierge aux rochers',
      description: 'Considérée par les historiens comme la première des deux versions.',
      image: 'assets/images/0000.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1483,
      dimension: '199 × 122 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
      creationDate: '30/11/1920',
      property: 'Dépôt',
    },
    {
      id: 8,
      titre: 'Les Noces de Cana',
      description: "Une huile sur toile d'Eugène Delacroix  ",
      image: 'assets/images/304.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Peinture',
      editeur: 'Paul Véronèse',
      anneeCreation: 1563,
      dimension: '677 × 994 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
      creationDate: '19/01/1990',
      property: 'Propriété',
    },
    {
      id: 9,
      titre: 'Victoire de Samothrace',
      description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
      image: 'assets/images/343 .jpg',
      vip: 'false',
      status: 'notRecieved',
      domaine: 'Sculpture',
      editeur: '',
      anneeCreation: 1863,
      dimension: '77 × 53 cm',
      matiere: 'Marbre',
      style: 'Sculpture',
      creationDate: '30/11/1920',
      property: 'Dépôt',
    },
    {
      id: 10,
      titre: "Vénus d'Arles",
      description: 'une sculpture en marbre dégagée en 1651',
      image: 'assets/images/365.jpg',
      vip: 'false',
      status: 'notRecieved',
      domaine: 'Sculpture',
      editeur: '',
      dimension: '194 cm (hauteur)',
      anneeCreation: 1651,
      matiere: 'Marbre',
      style: 'Tableau non classés',
      creationDate: '21/02/1920',
      property: 'Dépôt',
    },
    {
      id: 11,
      titre: 'Saint Jean-Baptiste',
      description: ' Peint sur une planche de noyer et mesure 69 × 57 cm',
      image: 'assets/images/12.jpg',
      vip: 'false',
      status: 'recieved',
      domaine: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1516,
      dimension: '69 × 57 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
      creationDate: '30/11/1920',
      property: 'Propriété',
    },
  ];

  ColDef: ColDef[] = [
    {
      headerName: 'N°',
      field: 'id',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: false,
      filter: false,
      width: 70,
    },
    {
      headerName: 'Titre',
      field: 'titre',
    },
    {
      headerName: 'Date création',
      field: 'creationDate',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.date,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: 'Déposant',
      field: 'depostant',
    },
    {
      headerName: 'Domaine',
      field: 'domaine',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.list,
        list: this.WorkOfArtService.domaine,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: 'Style',
      field: 'style',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
    {
      headerName: 'Matière',
      field: 'matiere',
    },
    {
      headerName: 'Dénomination',
      field: 'denomination',
    },
    {
      headerName: 'Epoque',
      field: 'epoque',
    },
    {
      headerName: 'Propriété',
      field: 'property',
    },
    {
      headerName: 'Dimension',
      field: 'dimension',
    },
    {
      headerName: 'Nombre',
      field: 'number',
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 130,
    },
  ];
  pinnedCols: string[] = ['action'];
  leftPinnedCols: string[] = ['id'];

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  currentColumnStates: any;
  columns: any;
  currentFilters: ColumnFilterModel[] = [];
  currentOrderedFields: { column: string; direction: string }[] = [];
  paginatorLoading: boolean;
  oeuvreToShow: any;

  constructor(
    private fb: FormBuilder,
    public columnFilterService: ColumnFilterService,
    private WorkOfArtService: WorkOfArtService
  ) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.oeuvreToShow = this.oeuvres;
    this.initFilterFormGroup();
    this.gridOptions.tooltipShowDelay = 0;
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
    this.currentColumnStates = this.gridColumnApi.getColumnState();
    this.columns = this.gridColumnApi.getAllColumns();
  }

  onHeaderToggle(column: Column): void {
    // hide column and reset filters
    this.gridColumnApi.setColumnVisible(column.getColId(), !column.isVisible());
    // this.gridApi.sizeColumnsToFit();
    this.gridApi.setFilterModel(null);
    this.updateColumnsConfiguration('visibility');
  }

  initFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      titre: '',
    });
  }

  updateColumnsConfiguration(type: string = 'position') {
    let successMessage: string;
    let errorMessage: string;
    if (type === 'position') {
      successMessage = 'actions.update_column_order_success';
      errorMessage = 'actions.update_column_order_error';
    } else {
      successMessage = 'actions.update_column_order_visibility_success';
      errorMessage = 'actions.update_column_order_visibility_error';
    }
    this.currentColumnStates = this.gridColumnApi.getColumnState();
  }

  updateFilteredData(columnFilters: ColumnFilterModel[]) {
    this.currentFilters = this.columnFilterService.updateCurrentFilter(this.currentFilters, columnFilters);
    columnFilters.forEach((value: any) => {
      this.oeuvreToShow = this.oeuvreToShow.filter((oeuvre: any) => {
        let column = value.column;
        if (value.value instanceof Array) {
          return oeuvre[column].toUpperCase().includes(value.value[0].toUpperCase());
        } else {
          return oeuvre[column].toUpperCase().includes(value.value.toUpperCase());
        }
      });
    });
  }

  updateSortedData(column: string, direction: string) {
    this.currentOrderedFields = [{ column, direction }];
  }

  getOrdersData(page: number = 1) {
    this.paginatorLoading = true;
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  search(event?: any) {
    if (event.target.value.length > 0) {
      this.oeuvreToShow = this.oeuvres.filter((x: any) =>
        x.titre.toUpperCase().includes(event.target.value.toUpperCase())
      );
    } else {
      this.oeuvreToShow = this.oeuvres;
    }
  }

  resetFilter() {
    this.oeuvreToShow = this.oeuvres;
  }
}
