export class Card {
  id: number = null;
  order: number;
  icon: string;
  cardTitle: string;
  cardSlug: string;
  cardText: string[];
  cardTextChoices: string[];
  notes_count = 0;

  constructor(
    id: number,
    cardSlug: string,
    order: number,
    icon: string,
    cardTitle: string,
    cardText: string[],
    cardTextChoices: string[],
    notes_count: number
  ) {
    this.id = id;
    this.cardSlug = cardSlug;
    this.order = order;
    this.icon = icon;
    this.cardTitle = cardTitle;
    this.cardText = cardText;
    this.cardTextChoices = cardTextChoices;
    this.notes_count = notes_count;
  }
}
