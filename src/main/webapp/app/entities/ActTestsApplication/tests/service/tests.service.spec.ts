import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITests } from '../tests.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tests.test-samples';

import { TestsService } from './tests.service';

const requireRestSample: ITests = {
  ...sampleWithRequiredData,
};

describe('Tests Service', () => {
  let service: TestsService;
  let httpMock: HttpTestingController;
  let expectedResult: ITests | ITests[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Tests', () => {
      const tests = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tests).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tests', () => {
      const tests = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tests).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tests', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tests', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tests', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTestsToCollectionIfMissing', () => {
      it('should add a Tests to an empty array', () => {
        const tests: ITests = sampleWithRequiredData;
        expectedResult = service.addTestsToCollectionIfMissing([], tests);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tests);
      });

      it('should not add a Tests to an array that contains it', () => {
        const tests: ITests = sampleWithRequiredData;
        const testsCollection: ITests[] = [
          {
            ...tests,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTestsToCollectionIfMissing(testsCollection, tests);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tests to an array that doesn't contain it", () => {
        const tests: ITests = sampleWithRequiredData;
        const testsCollection: ITests[] = [sampleWithPartialData];
        expectedResult = service.addTestsToCollectionIfMissing(testsCollection, tests);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tests);
      });

      it('should add only unique Tests to an array', () => {
        const testsArray: ITests[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const testsCollection: ITests[] = [sampleWithRequiredData];
        expectedResult = service.addTestsToCollectionIfMissing(testsCollection, ...testsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tests: ITests = sampleWithRequiredData;
        const tests2: ITests = sampleWithPartialData;
        expectedResult = service.addTestsToCollectionIfMissing([], tests, tests2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tests);
        expect(expectedResult).toContain(tests2);
      });

      it('should accept null and undefined values', () => {
        const tests: ITests = sampleWithRequiredData;
        expectedResult = service.addTestsToCollectionIfMissing([], null, tests, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tests);
      });

      it('should return initial array if no Tests is added', () => {
        const testsCollection: ITests[] = [sampleWithRequiredData];
        expectedResult = service.addTestsToCollectionIfMissing(testsCollection, undefined, null);
        expect(expectedResult).toEqual(testsCollection);
      });
    });

    describe('compareTests', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTests(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTests(entity1, entity2);
        const compareResult2 = service.compareTests(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTests(entity1, entity2);
        const compareResult2 = service.compareTests(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTests(entity1, entity2);
        const compareResult2 = service.compareTests(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
