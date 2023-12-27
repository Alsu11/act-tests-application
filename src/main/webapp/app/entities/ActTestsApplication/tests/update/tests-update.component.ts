import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMaterial } from 'app/entities/ActTestsApplication/material/material.model';
import { MaterialService } from 'app/entities/ActTestsApplication/material/service/material.service';
import { ITests } from '../tests.model';
import { TestsService } from '../service/tests.service';
import { TestsFormService, TestsFormGroup } from './tests-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tests-update',
  templateUrl: './tests-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TestsUpdateComponent implements OnInit {
  isSaving = false;
  tests: ITests | null = null;

  materialsSharedCollection: IMaterial[] = [];

  editForm: TestsFormGroup = this.testsFormService.createTestsFormGroup();

  constructor(
    protected testsService: TestsService,
    protected testsFormService: TestsFormService,
    protected materialService: MaterialService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareMaterial = (o1: IMaterial | null, o2: IMaterial | null): boolean => this.materialService.compareMaterial(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tests }) => {
      this.tests = tests;
      if (tests) {
        this.updateForm(tests);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tests = this.testsFormService.getTests(this.editForm);
    if (tests.id !== null) {
      this.subscribeToSaveResponse(this.testsService.update(tests));
    } else {
      this.subscribeToSaveResponse(this.testsService.create(tests));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITests>>): void {
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

  protected updateForm(tests: ITests): void {
    this.tests = tests;
    this.testsFormService.resetForm(this.editForm, tests);

    this.materialsSharedCollection = this.materialService.addMaterialToCollectionIfMissing<IMaterial>(
      this.materialsSharedCollection,
      tests.materialId,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.materialService
      .query()
      .pipe(map((res: HttpResponse<IMaterial[]>) => res.body ?? []))
      .pipe(
        map((materials: IMaterial[]) =>
          this.materialService.addMaterialToCollectionIfMissing<IMaterial>(materials, this.tests?.materialId),
        ),
      )
      .subscribe((materials: IMaterial[]) => (this.materialsSharedCollection = materials));
  }
}
