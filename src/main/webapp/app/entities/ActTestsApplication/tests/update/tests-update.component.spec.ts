import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IMaterial } from 'app/entities/ActTestsApplication/material/material.model';
import { MaterialService } from 'app/entities/ActTestsApplication/material/service/material.service';
import { TestsService } from '../service/tests.service';
import { ITests } from '../tests.model';
import { TestsFormService } from './tests-form.service';

import { TestsUpdateComponent } from './tests-update.component';

describe('Tests Management Update Component', () => {
  let comp: TestsUpdateComponent;
  let fixture: ComponentFixture<TestsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let testsFormService: TestsFormService;
  let testsService: TestsService;
  let materialService: MaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TestsUpdateComponent],
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
      .overrideTemplate(TestsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TestsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    testsFormService = TestBed.inject(TestsFormService);
    testsService = TestBed.inject(TestsService);
    materialService = TestBed.inject(MaterialService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Material query and add missing value', () => {
      const tests: ITests = { id: 456 };
      const materialId: IMaterial = { id: 9619 };
      tests.materialId = materialId;

      const materialCollection: IMaterial[] = [{ id: 26344 }];
      jest.spyOn(materialService, 'query').mockReturnValue(of(new HttpResponse({ body: materialCollection })));
      const additionalMaterials = [materialId];
      const expectedCollection: IMaterial[] = [...additionalMaterials, ...materialCollection];
      jest.spyOn(materialService, 'addMaterialToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tests });
      comp.ngOnInit();

      expect(materialService.query).toHaveBeenCalled();
      expect(materialService.addMaterialToCollectionIfMissing).toHaveBeenCalledWith(
        materialCollection,
        ...additionalMaterials.map(expect.objectContaining),
      );
      expect(comp.materialsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tests: ITests = { id: 456 };
      const materialId: IMaterial = { id: 6721 };
      tests.materialId = materialId;

      activatedRoute.data = of({ tests });
      comp.ngOnInit();

      expect(comp.materialsSharedCollection).toContain(materialId);
      expect(comp.tests).toEqual(tests);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITests>>();
      const tests = { id: 123 };
      jest.spyOn(testsFormService, 'getTests').mockReturnValue(tests);
      jest.spyOn(testsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tests });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tests }));
      saveSubject.complete();

      // THEN
      expect(testsFormService.getTests).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(testsService.update).toHaveBeenCalledWith(expect.objectContaining(tests));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITests>>();
      const tests = { id: 123 };
      jest.spyOn(testsFormService, 'getTests').mockReturnValue({ id: null });
      jest.spyOn(testsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tests: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tests }));
      saveSubject.complete();

      // THEN
      expect(testsFormService.getTests).toHaveBeenCalled();
      expect(testsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITests>>();
      const tests = { id: 123 };
      jest.spyOn(testsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tests });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(testsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMaterial', () => {
      it('Should forward to materialService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(materialService, 'compareMaterial');
        comp.compareMaterial(entity, entity2);
        expect(materialService.compareMaterial).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
