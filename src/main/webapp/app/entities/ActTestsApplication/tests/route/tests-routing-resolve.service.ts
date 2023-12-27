import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITests } from '../tests.model';
import { TestsService } from '../service/tests.service';

export const testsResolve = (route: ActivatedRouteSnapshot): Observable<null | ITests> => {
  const id = route.params['id'];
  if (id) {
    return inject(TestsService)
      .find(id)
      .pipe(
        mergeMap((tests: HttpResponse<ITests>) => {
          if (tests.body) {
            return of(tests.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default testsResolve;
