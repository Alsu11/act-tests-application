import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ITests } from 'app/entities/ActTestsApplication/tests/tests.model';
import { TestsService } from 'app/entities/ActTestsApplication/tests/service/tests.service';
import { QuestionService } from '../service/question.service';
import { IQuestion } from '../question.model';
import { QuestionFormService } from './question-form.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Question Management Update Component', () => {
  let comp: QuestionUpdateComponent;
  let fixture: ComponentFixture<QuestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionFormService: QuestionFormService;
  let questionService: QuestionService;
  let testsService: TestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), QuestionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(QuestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionFormService = TestBed.inject(QuestionFormService);
    questionService = TestBed.inject(QuestionService);
    testsService = TestBed.inject(TestsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Tests query and add missing value', () => {
      const question: IQuestion = { id: 456 };
      const testId: ITests = { id: 22132 };
      question.testId = testId;

      const testsCollection: ITests[] = [{ id: 27744 }];
      jest.spyOn(testsService, 'query').mockReturnValue(of(new HttpResponse({ body: testsCollection })));
      const additionalTests = [testId];
      const expectedCollection: ITests[] = [...additionalTests, ...testsCollection];
      jest.spyOn(testsService, 'addTestsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(testsService.query).toHaveBeenCalled();
      expect(testsService.addTestsToCollectionIfMissing).toHaveBeenCalledWith(
        testsCollection,
        ...additionalTests.map(expect.objectContaining),
      );
      expect(comp.testsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const question: IQuestion = { id: 456 };
      const testId: ITests = { id: 20726 };
      question.testId = testId;

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(comp.testsSharedCollection).toContain(testId);
      expect(comp.question).toEqual(question);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestion>>();
      const question = { id: 123 };
      jest.spyOn(questionFormService, 'getQuestion').mockReturnValue(question);
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(questionFormService.getQuestion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionService.update).toHaveBeenCalledWith(expect.objectContaining(question));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestion>>();
      const question = { id: 123 };
      jest.spyOn(questionFormService, 'getQuestion').mockReturnValue({ id: null });
      jest.spyOn(questionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(questionFormService.getQuestion).toHaveBeenCalled();
      expect(questionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestion>>();
      const question = { id: 123 };
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTests', () => {
      it('Should forward to testsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(testsService, 'compareTests');
        comp.compareTests(entity, entity2);
        expect(testsService.compareTests).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
