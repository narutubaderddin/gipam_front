import { Injectable } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable()
export class AddRemarquerResolver implements Resolve<any> {
  constructor(private workOfArtService: WorkOfArtService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const id = route.queryParamMap.get('id');
    const duplication = route.queryParamMap.get('dupliquer');
    console.log(duplication);
    if (id) {
      let params = {
        serializer_group: JSON.stringify(['response', 'artwork']),
      };
      const result = this.workOfArtService.getWorkOfArtById(id, params);
      let isDuplication: any;
      duplication ? (isDuplication = of(duplication)) : (isDuplication = of(false));
      return forkJoin([result, isDuplication]);
    } else {
      return false;
    }
  }
}
