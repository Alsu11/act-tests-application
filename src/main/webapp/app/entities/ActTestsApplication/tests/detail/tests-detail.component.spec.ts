import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TestsDetailComponent } from './tests-detail.component';

describe('Tests Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TestsDetailComponent,
              resolve: { tests: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TestsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tests on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TestsDetailComponent);

      // THEN
      expect(instance.tests).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
