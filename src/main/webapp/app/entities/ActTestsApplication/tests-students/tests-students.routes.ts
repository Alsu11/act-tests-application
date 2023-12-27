import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TestsStudentsComponent } from './list/tests-students.component';
import { TestsStudentsDetailComponent } from './detail/tests-students-detail.component';
import { TestsStudentsUpdateComponent } from './update/tests-students-update.component';
import TestsStudentsResolve from './route/tests-students-routing-resolve.service';

const testsStudentsRoute: Routes = [
  {
    path: '',
    component: TestsStudentsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TestsStudentsDetailComponent,
    resolve: {
      testsStudents: TestsStudentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TestsStudentsUpdateComponent,
    resolve: {
      testsStudents: TestsStudentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TestsStudentsUpdateComponent,
    resolve: {
      testsStudents: TestsStudentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default testsStudentsRoute;
