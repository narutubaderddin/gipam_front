import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AddRemarquerComponent } from './add-remarquer.component';

@Injectable({
  providedIn: 'root',
})
export class NameFormCanDeactivateGuard implements CanDeactivate<AddRemarquerComponent> {
  canDeactivate(component: AddRemarquerComponent) {
    return component.canDeactivate();
  }
}
