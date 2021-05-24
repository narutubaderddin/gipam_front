import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { lastArtOfWorkDetailIndex, searchPageFilter } from '@shared/utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class ItemDetailsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const newParams = JSON.parse(localStorage.getItem(searchPageFilter));
    const index = JSON.parse(localStorage.getItem(lastArtOfWorkDetailIndex));

    if (newParams?.page && index) {
      return true;
    }
    this.router.navigate(['/oeuvres-list'], { replaceUrl: true });
    return false;
  }
}
