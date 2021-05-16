import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DirtyComponent } from '../components/dirty-component';

@Injectable({
  providedIn: 'root',
})
export class DirtyCheckGuard implements CanDeactivate<DirtyComponent> {
  canDeactivate(
    component: DirtyComponent,
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
