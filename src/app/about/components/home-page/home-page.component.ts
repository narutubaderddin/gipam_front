import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  oeuvreToShow: any = [];
  dropdownSettings = {};
  selectedItems: any = [];
  oeuvre = [
    {
      id: 0,
      titre: 'Vénus de Milo',
      auteur: 'auteur',
      description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
      mots_descriptifs: 'mots_descriptifs',
      commentaire: 'commentaire',
      image: '../../assets/images/venus.jpg',
      vip: 'true',
      type: 'Sculpture',
      editeur: "Alexandros d'Antioche",
      anneeCreation: 1820,
      dimension: '202x36x64',
      matiere: 'Marbre',
      style: 'Tableau non classés',
    },
    {
      id: 1,
      titre: 'La Joconde',
      description: 'Le Portrait de Mona Lisa est celui de la Florentine Lisa Gherardini',
      image: '../../assets/images/joconde.jpg',
      vip: 'true',
      status: 'notRecieved',
      type: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1519,
      dimension: '77 × 53 cm',
      style: 'Renaissance',
      matiere: 'Huile sur panneau de bois',
    },
    {
      id: 2,
      titre: 'La Belle Ferronnière',
      description: 'Un tableau peint sur un panneau en bois de noyer',
      image: '../../assets/images/labelle.jpg',
      vip: 'false',
      status: 'recieved',
      type: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1497,
      dimension: '62 × 44 cm',
      style: 'Renaissance',
      matiere: 'Huile sur panneau de bois',
    },
    {
      id: 3,
      titre: 'La Liberté guidant le peuple',
      description: "Une huile sur toile d'Eugène Delacroix  ",
      image: '../../assets/images/liberte.jpg',
      vip: 'false',
      status: 'recieved',
      type: 'Sculpture',
      editeur: 'Eugène Delacroix',
      anneeCreation: 1830,
      dimension: '260 × 325 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
    },
    {
      id: 4,
      titre: 'ECOLE FRANCAISE VERS 1830,D’APRÈS PIERRE...',
      description: 'ECOLE FRANCAISE VERS 1830, D’APRÈS PIERRE...',
      image: '../../assets/images/ecole.png',
      vip: 'false',
      status: 'recieved',
      type: 'Peinture',
      editeur: '',
      anneeCreation: '',
      dimension: '77 × 53 cm',
      style: 'Tableau non classés',
    },
    {
      id: 5,
      titre: 'Victoire de Samothrace',
      description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
      image: '../../assets/images/samothrace.jpg',
      vip: 'false',
      status: 'notRecieved',
      type: 'Sculpture',
      anneeCreation: 1863,
      dimension: '77 × 53 cm',
      matiere: 'Marbre',
      style: 'Tableau non classés',
    },
    {
      id: 6,
      titre: "L'Esclave mourant",
      auteur: 'auteur',
      description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
      mots_descriptifs: 'mots_descriptifs',
      commentaire: 'commentaire',
      image: '../../assets/images/esclave.jpg',
      vip: 'true',
      type: 'Sculpture',
      editeur: 'Michel-Ange',
      anneeCreation: 1820,
      dimension: '202x36x64',
      matiere: 'Marbre',
      style: 'Tableau non classés',
    },

    {
      id: 7,
      titre: 'La Vierge aux rochers',
      description: 'Considérée par les historiens comme la première des deux versions.',
      image: '../../assets/images/lavierge.jpg',
      vip: 'false',
      status: 'recieved',
      type: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1483,
      dimension: '199 × 122 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
    },
    {
      id: 8,
      titre: 'Les Noces de Cana',
      description: "Une huile sur toile d'Eugène Delacroix  ",
      image: '../../assets/images/noce.jpg',
      vip: 'false',
      status: 'recieved',
      type: 'Peinture',
      editeur: 'Paul Véronèse',
      anneeCreation: 1563,
      dimension: '677 × 994 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
    },
    {
      id: 9,
      titre: 'Victoire de Samothrace',
      description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
      image: '../../assets/images/samothrace.jpg',
      vip: 'false',
      status: 'notRecieved',
      type: 'Sculpture',
      editeur: '',
      anneeCreation: 1863,
      dimension: '77 × 53 cm',
      matiere: 'Marbre',
      style: 'Sculpture',
    },
    {
      id: 10,
      titre: "Vénus d'Arles",
      description: 'une sculpture en marbre dégagée en 1651',
      image: '../../assets/images/venusarles.jpg',
      vip: 'false',
      status: 'notRecieved',
      type: 'Sculpture',
      editeur: '',
      dimension: '194 cm (hauteur)',
      anneeCreation: 1651,
      matiere: 'Marbre',
      style: 'Tableau non classés',
    },
    {
      id: 11,
      titre: 'Saint Jean-Baptiste',
      description: ' Peint sur une planche de noyer et mesure 69 × 57 cm',
      image: '../../assets/images/saint.jpg',
      vip: 'false',
      status: 'recieved',
      type: 'Peinture',
      editeur: 'Léonard de Vinci',
      anneeCreation: 1516,
      dimension: '69 × 57 cm',
      matiere: 'Huile sur panneau de bois',
      style: 'Renaissance',
    },
  ];
  styles = [
    { id: 1, style: 'Renaissance' },
    { id: 2, style: 'Moyen âge' },
    { id: 3, style: 'Tableau non classés' },
  ];
  mode = 'pictures';

  openType = false;
  filter = false;
  constructor(private router: Router) {}

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
    this.router.navigate(['oneitem']);
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

  onDeselect(event: any) {}
}
