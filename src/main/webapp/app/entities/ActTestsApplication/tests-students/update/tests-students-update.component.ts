import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/ActTestsApplication/student/student.model';
import { StudentService } from 'app/entities/ActTestsApplication/student/service/student.service';
import { ITests } from 'app/entities/ActTestsApplication/tests/tests.model';
import { TestsService } from 'app/entities/ActTestsApplication/tests/service/tests.service';
import { TestsStudentsService } from '../service/tests-students.service';
import { ITestsStudents } from '../tests-students.model';
import { TestsStudentsFormService, TestsStudentsFormGroup } from './tests-students-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tests-students-update',
  templateUrl: './tests-students-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TestsStudentsUpdateComponent implements OnInit {
  isSaving = false;
  testsStudents: ITestsStudents | null = null;

  studentsSharedCollection: IStudent[] = [];
  testsSharedCollection: ITests[] = [];

  editForm: TestsStudentsFormGroup = this.testsStudentsFormService.createTestsStudentsFormGroup();

  constructor(
    protected testsStudentsService: TestsStudentsService,
    protected testsStudentsFormService: TestsStudentsFormService,
    protected studentService: StudentService,
    protected testsService: TestsService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareTests = (o1: ITests | null, o2: ITests | null): boolean => this.testsService.compareTests(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ testsStudents }) => {
      this.testsStudents = testsStudents;
      if (testsStudents) {
        this.updateForm(testsStudents);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const testsStudents = this.testsStudentsFormService.getTestsStudents(this.editForm);
    if (testsStudents.id !== null) {
      this.subscribeToSaveResponse(this.testsStudentsService.update(testsStudents));
    } else {
      this.subscribeToSaveResponse(this.testsStudentsService.create(testsStudents));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITestsStudents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(testsStudents: ITestsStudents): void {
    this.testsStudents = testsStudents;
    this.testsStudentsFormService.resetForm(this.editForm, testsStudents);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      testsStudents.studentId,
    );
    this.testsSharedCollection = this.testsService.addTestsToCollectionIfMissing<ITests>(this.testsSharedCollection, testsStudents.testId);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.testsStudents?.studentId),
        ),
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.testsService
      .query()
      .pipe(map((res: HttpResponse<ITests[]>) => res.body ?? []))
      .pipe(map((tests: ITests[]) => this.testsService.addTestsToCollectionIfMissing<ITests>(tests, this.testsStudents?.testId)))
      .subscribe((tests: ITests[]) => (this.testsSharedCollection = tests));
  }
}
