import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tests.test-samples';

import { TestsFormService } from './tests-form.service';

describe('Tests Form Service', () => {
  let service: TestsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestsFormService);
  });

  describe('Service methods', () => {
    describe('createTestsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTestsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            materialId: expect.any(Object),
          }),
        );
      });

      it('passing ITests should create a new form with FormGroup', () => {
        const formGroup = service.createTestsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            materialId: expect.any(Object),
          }),
        );
      });
    });

    describe('getTests', () => {
      it('should return NewTests for default Tests initial value', () => {
        const formGroup = service.createTestsFormGroup(sampleWithNewData);

        const tests = service.getTests(formGroup) as any;

        expect(tests).toMatchObject(sampleWithNewData);
      });

      it('should return NewTests for empty Tests initial value', () => {
        const formGroup = service.createTestsFormGroup();

        const tests = service.getTests(formGroup) as any;

        expect(tests).toMatchObject({});
      });

      it('should return ITests', () => {
        const formGroup = service.createTestsFormGroup(sampleWithRequiredData);

        const tests = service.getTests(formGroup) as any;

        expect(tests).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITests should not enable id FormControl', () => {
        const formGroup = service.createTestsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTests should disable id FormControl', () => {
        const formGroup = service.createTestsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
