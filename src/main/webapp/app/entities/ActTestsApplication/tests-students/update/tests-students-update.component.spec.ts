import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/ActTestsApplication/student/student.model';
import { StudentService } from 'app/entities/ActTestsApplication/student/service/student.service';
import { ITests } from 'app/entities/ActTestsApplication/tests/tests.model';
import { TestsService } from 'app/entities/ActTestsApplication/tests/service/tests.service';
import { ITestsStudents } from '../tests-students.model';
import { TestsStudentsService } from '../service/tests-students.service';
import { TestsStudentsFormService } from './tests-students-form.service';

import { TestsStudentsUpdateComponent } from './tests-students-update.component';

describe('TestsStudents Management Update Component', () => {
  let comp: TestsStudentsUpdateComponent;
  let fixture: ComponentFixture<TestsStudentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let testsStudentsFormService: TestsStudentsFormService;
  let testsStudentsService: TestsStudentsService;
  let studentService: StudentService;
  let testsService: TestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TestsStudentsUpdateComponent],
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
      .overrideTemplate(TestsStudentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TestsStudentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    testsStudentsFormService = TestBed.inject(TestsStudentsFormService);
    testsStudentsService = TestBed.inject(TestsStudentsService);
    studentService = TestBed.inject(StudentService);
    testsService = TestBed.inject(TestsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const testsStudents: ITestsStudents = { id: 456 };
      const studentId: IStudent = { id: 7701 };
      testsStudents.studentId = studentId;

      const studentCollection: IStudent[] = [{ id: 31603 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [studentId];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ testsStudents });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tests query and add missing value', () => {
      const testsStudents: ITestsStudents = { id: 456 };
      const testId: ITests = { id: 13865 };
      testsStudents.testId = testId;

      const testsCollection: ITests[] = [{ id: 18411 }];
      jest.spyOn(testsService, 'query').mockReturnValue(of(new HttpResponse({ body: testsCollection })));
      const additionalTests = [testId];
      const expectedCollection: ITests[] = [...additionalTests, ...testsCollection];
      jest.spyOn(testsService, 'addTestsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ testsStudents });
      comp.ngOnInit();

      expect(testsService.query).toHaveBeenCalled();
      expect(testsService.addTestsToCollectionIfMissing).toHaveBeenCalledWith(
        testsCollection,
        ...additionalTests.map(expect.objectContaining),
      );
      expect(comp.testsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const testsStudents: ITestsStudents = { id: 456 };
      const studentId: IStudent = { id: 11871 };
      testsStudents.studentId = studentId;
      const testId: ITests = { id: 4890 };
      testsStudents.testId = testId;

      activatedRoute.data = of({ testsStudents });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(studentId);
      expect(comp.testsSharedCollection).toContain(testId);
      expect(comp.testsStudents).toEqual(testsStudents);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITestsStudents>>();
      const testsStudents = { id: 123 };
      jest.spyOn(testsStudentsFormService, 'getTestsStudents').mockReturnValue(testsStudents);
      jest.spyOn(testsStudentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testsStudents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: testsStudents }));
      saveSubject.complete();

      // THEN
      expect(testsStudentsFormService.getTestsStudents).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(testsStudentsService.update).toHaveBeenCalledWith(expect.objectContaining(testsStudents));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITestsStudents>>();
      const testsStudents = { id: 123 };
      jest.spyOn(testsStudentsFormService, 'getTestsStudents').mockReturnValue({ id: null });
      jest.spyOn(testsStudentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testsStudents: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: testsStudents }));
      saveSubject.complete();

      // THEN
      expect(testsStudentsFormService.getTestsStudents).toHaveBeenCalled();
      expect(testsStudentsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITestsStudents>>();
      const testsStudents = { id: 123 };
      jest.spyOn(testsStudentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testsStudents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(testsStudentsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
