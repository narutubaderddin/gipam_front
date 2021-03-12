import { Attribute, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-accordion-section',
  templateUrl: './accordion-section.component.html',
  styleUrls: ['./accordion-section.component.scss'],
})
export class AccordionSectionComponent implements OnInit {
  @ViewChild('toggleBtn') toggleBtn: ElementRef;
  @Output() collapseAccordion = new EventEmitter();
  @Output() accordionTitle = new EventEmitter<string>();
  @Output() accordionIndex = new EventEmitter<string>();
  @Output() titleFormSubmitted = new EventEmitter<boolean>();
  @Output() accordionOpen = new EventEmitter();
  @Output() noteAdded = new EventEmitter();
  @Input() backgroundColor: string;
  @Input() headerTitle: string;
  @Input() notesBloc = false;
  @Input() headerSlug: string;
  @Input() icon: string;
  @Input() notes = 0;
  @Input() personaeId: number;
  @Input() editable = false;
  @Input() hasNote = true;
  @Input() toogleNote = false;
  @Input() showIcon = false;
  @Input() index: number;
  @Input() sectionTitle: string;
  @Input() titleForm: FormGroup;
  @Input() sectionIndex: any;
  @Input() milestoneSectionId: any;
  @Input() alterableSection = false;
  @Input() showCrayon = true;
  @Input() scenarioMode = false;
  @Input() removable = true;
  @Input() collapse = true;
  @Input() disabled: boolean;
  @Input() personaeMode = false;
  @Input() generatedScenariosFormArray: FormArray;
  @Input() milestoneId: number;
  @Input() financialSearchZoneSection: { financial: Attribute; searchZone: Attribute };
  @Input() scenarioSynthesisAttribute: Attribute;
  @Input() commentSection: string;
  @Input() commentsTest: Comment[];
  @Input() listDocumentSection: false;
  @Input() idMilestoneSection: any;
  @Input() draggable = false;
  comments: Comment[] = [];
  commentActive = false;
  sectionId: string;
  show = false;
  modeEdit = false;
  constructor() {}

  ngOnInit(): void {
    this.sectionId = this.generateAccordionId();
    if (this.show) {
      this.toggleBtn.nativeElement.click();
    }

    if (!this.collapse) {
      this.show = true;
    }
  }

  generateAccordionId() {
    return 'app-accordion' + new Date().getTime() + Math.random().toString(36).substr(2, 9);
  }

  toggle(event: MouseEvent, target: HTMLDivElement) {
    this.show = !this.show;
    // @ts-ignore
    if (event.target.classList.contains('bg-fleche-down')) {
      this.accordionOpen.emit();
      this.collapseAccordion.emit(event);
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }

  noScrollToggle($event: MouseEvent) {
    this.show = !this.show;
    this.accordionOpen.emit();
  }
}
