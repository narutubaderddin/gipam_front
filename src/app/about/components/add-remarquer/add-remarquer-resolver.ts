import { Injectable } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AddRemarquerResolver implements Resolve<any> {
  constructor(private workOfArtService: WorkOfArtService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const id = route.queryParamMap.get('id');
    if (id) {
      let params = {
        serializer_group: JSON.stringify(['response', 'artwork']),
      };

      return this.workOfArtService.getWorkOfArtById(id, params);
    } else {
      return of(false);
    }
  }
}