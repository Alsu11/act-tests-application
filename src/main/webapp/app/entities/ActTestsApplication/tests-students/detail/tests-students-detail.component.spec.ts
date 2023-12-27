import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TestsStudentsDetailComponent } from './tests-students-detail.component';

describe('TestsStudents Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsStudentsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TestsStudentsDetailComponent,
              resolve: { testsStudents: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TestsStudentsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load testsStudents on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TestsStudentsDetailComponent);

      // THEN
      expect(instance.testsStudents).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
