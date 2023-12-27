import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITests, NewTests } from '../tests.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITests for edit and NewTestsFormGroupInput for create.
 */
type TestsFormGroupInput = ITests | PartialWithRequiredKeyOf<NewTests>;

type TestsFormDefaults = Pick<NewTests, 'id'>;

type TestsFormGroupContent = {
  id: FormControl<ITests['id'] | NewTests['id']>;
  subject: FormControl<ITests['subject']>;
  materialId: FormControl<ITests['materialId']>;
};

export type TestsFormGroup = FormGroup<TestsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TestsFormService {
  createTestsFormGroup(tests: TestsFormGroupInput = { id: null }): TestsFormGroup {
    const testsRawValue = {
      ...this.getFormDefaults(),
      ...tests,
    };
    return new FormGroup<TestsFormGroupContent>({
      id: new FormControl(
        { value: testsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      subject: new FormControl(testsRawValue.subject),
      materialId: new FormControl(testsRawValue.materialId),
    });
  }

  getTests(form: TestsFormGroup): ITests | NewTests {
    return form.getRawValue() as ITests | NewTests;
  }

  resetForm(form: TestsFormGroup, tests: TestsFormGroupInput): void {
    const testsRawValue = { ...this.getFormDefaults(), ...tests };
    form.reset(
      {
        ...testsRawValue,
        id: { value: testsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TestsFormDefaults {
    return {
      id: null,
    };
  }
}
