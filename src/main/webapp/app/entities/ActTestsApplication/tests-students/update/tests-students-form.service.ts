import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITestsStudents, NewTestsStudents } from '../tests-students.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITestsStudents for edit and NewTestsStudentsFormGroupInput for create.
 */
type TestsStudentsFormGroupInput = ITestsStudents | PartialWithRequiredKeyOf<NewTestsStudents>;

type TestsStudentsFormDefaults = Pick<NewTestsStudents, 'id'>;

type TestsStudentsFormGroupContent = {
  id: FormControl<ITestsStudents['id'] | NewTestsStudents['id']>;
  result: FormControl<ITestsStudents['result']>;
  studentId: FormControl<ITestsStudents['studentId']>;
  testId: FormControl<ITestsStudents['testId']>;
};

export type TestsStudentsFormGroup = FormGroup<TestsStudentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TestsStudentsFormService {
  createTestsStudentsFormGroup(testsStudents: TestsStudentsFormGroupInput = { id: null }): TestsStudentsFormGroup {
    const testsStudentsRawValue = {
      ...this.getFormDefaults(),
      ...testsStudents,
    };
    return new FormGroup<TestsStudentsFormGroupContent>({
      id: new FormControl(
        { value: testsStudentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      result: new FormControl(testsStudentsRawValue.result),
      studentId: new FormControl(testsStudentsRawValue.studentId),
      testId: new FormControl(testsStudentsRawValue.testId),
    });
  }

  getTestsStudents(form: TestsStudentsFormGroup): ITestsStudents | NewTestsStudents {
    return form.getRawValue() as ITestsStudents | NewTestsStudents;
  }

  resetForm(form: TestsStudentsFormGroup, testsStudents: TestsStudentsFormGroupInput): void {
    const testsStudentsRawValue = { ...this.getFormDefaults(), ...testsStudents };
    form.reset(
      {
        ...testsStudentsRawValue,
        id: { value: testsStudentsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TestsStudentsFormDefaults {
    return {
      id: null,
    };
  }
}
