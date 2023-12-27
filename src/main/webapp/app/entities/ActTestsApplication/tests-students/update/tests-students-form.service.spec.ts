import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tests-students.test-samples';

import { TestsStudentsFormService } from './tests-students-form.service';

describe('TestsStudents Form Service', () => {
  let service: TestsStudentsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestsStudentsFormService);
  });

  describe('Service methods', () => {
    describe('createTestsStudentsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTestsStudentsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            result: expect.any(Object),
            studentId: expect.any(Object),
            testId: expect.any(Object),
          }),
        );
      });

      it('passing ITestsStudents should create a new form with FormGroup', () => {
        const formGroup = service.createTestsStudentsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            result: expect.any(Object),
            studentId: expect.any(Object),
            testId: expect.any(Object),
          }),
        );
      });
    });

    describe('getTestsStudents', () => {
      it('should return NewTestsStudents for default TestsStudents initial value', () => {
        const formGroup = service.createTestsStudentsFormGroup(sampleWithNewData);

        const testsStudents = service.getTestsStudents(formGroup) as any;

        expect(testsStudents).toMatchObject(sampleWithNewData);
      });

      it('should return NewTestsStudents for empty TestsStudents initial value', () => {
        const formGroup = service.createTestsStudentsFormGroup();

        const testsStudents = service.getTestsStudents(formGroup) as any;

        expect(testsStudents).toMatchObject({});
      });

      it('should return ITestsStudents', () => {
        const formGroup = service.createTestsStudentsFormGroup(sampleWithRequiredData);

        const testsStudents = service.getTestsStudents(formGroup) as any;

        expect(testsStudents).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITestsStudents should not enable id FormControl', () => {
        const formGroup = service.createTestsStudentsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTestsStudents should disable id FormControl', () => {
        const formGroup = service.createTestsStudentsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
