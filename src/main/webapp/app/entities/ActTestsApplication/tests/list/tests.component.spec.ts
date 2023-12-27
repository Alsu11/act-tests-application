import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TestsService } from '../service/tests.service';

import { TestsComponent } from './tests.component';

describe('Tests Management Component', () => {
  let comp: TestsComponent;
  let fixture: ComponentFixture<TestsComponent>;
  let service: TestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'acttestsapplication/tests', component: TestsComponent }]),
        HttpClientTestingModule,
        TestsComponent,
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
      .overrideTemplate(TestsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TestsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TestsService);

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
    expect(comp.tests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to testsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTestsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTestsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
