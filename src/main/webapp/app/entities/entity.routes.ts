import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'material',
    data: { pageTitle: 'actTestsApplicationApp.actTestsApplicationMaterial.home.title' },
    loadChildren: () => import('./ActTestsApplication/material/material.routes'),
  },
  {
    path: 'student',
    data: { pageTitle: 'actTestsApplicationApp.actTestsApplicationStudent.home.title' },
    loadChildren: () => import('./ActTestsApplication/student/student.routes'),
  },
  {
    path: 'tests',
    data: { pageTitle: 'actTestsApplicationApp.actTestsApplicationTests.home.title' },
    loadChildren: () => import('./ActTestsApplication/tests/tests.routes'),
  },
  {
    path: 'question',
    data: { pageTitle: 'actTestsApplicationApp.actTestsApplicationQuestion.home.title' },
    loadChildren: () => import('./ActTestsApplication/question/question.routes'),
  },
  {
    path: 'tests-students',
    data: { pageTitle: 'actTestsApplicationApp.actTestsApplicationTestsStudents.home.title' },
    loadChildren: () => import('./ActTestsApplication/tests-students/tests-students.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
