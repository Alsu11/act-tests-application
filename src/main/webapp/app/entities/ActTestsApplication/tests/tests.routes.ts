import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TestsComponent } from './list/tests.component';
import { TestsDetailComponent } from './detail/tests-detail.component';
import { TestsUpdateComponent } from './update/tests-update.component';
import TestsResolve from './route/tests-routing-resolve.service';

const testsRoute: Routes = [
  {
    path: '',
    component: TestsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TestsDetailComponent,
    resolve: {
      tests: TestsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TestsUpdateComponent,
    resolve: {
      tests: TestsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TestsUpdateComponent,
    resolve: {
      tests: TestsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default testsRoute;
