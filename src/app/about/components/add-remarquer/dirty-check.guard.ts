import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AddRemarquerComponent } from '@app/about/components/add-remarquer/add-remarquer.component';

@Injectable({
  providedIn: 'root',
})
export class DirtyCheckGuard implements CanDeactivate<AddRemarquerComponent> {
  canDeactivate(
    component: AddRemarquerComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()) {
      return confirm('Vous avez rempli certains champs du formulaire. Si vous arrêtez, vous les perderez.');
    } else {
      return true;
    }
  }
}
