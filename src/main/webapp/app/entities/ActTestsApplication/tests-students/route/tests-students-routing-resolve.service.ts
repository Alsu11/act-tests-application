import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITestsStudents } from '../tests-students.model';
import { TestsStudentsService } from '../service/tests-students.service';

export const testsStudentsResolve = (route: ActivatedRouteSnapshot): Observable<null | ITestsStudents> => {
  const id = route.params['id'];
  if (id) {
    return inject(TestsStudentsService)
      .find(id)
      .pipe(
        mergeMap((testsStudents: HttpResponse<ITestsStudents>) => {
          if (testsStudents.body) {
            return of(testsStudents.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default testsStudentsResolve;
