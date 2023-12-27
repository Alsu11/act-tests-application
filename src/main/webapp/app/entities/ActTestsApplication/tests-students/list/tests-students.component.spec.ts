import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TestsStudentsService } from '../service/tests-students.service';

import { TestsStudentsComponent } from './tests-students.component';

describe('TestsStudents Management Component', () => {
  let comp: TestsStudentsComponent;
  let fixture: ComponentFixture<TestsStudentsComponent>;
  let service: TestsStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'acttestsapplication/tests-students', component: TestsStudentsComponent }]),
        HttpClientTestingModule,
        TestsStudentsComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TestsStudentsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TestsStudentsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TestsStudentsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.testsStudents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to testsStudentsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTestsStudentsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTestsStudentsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
