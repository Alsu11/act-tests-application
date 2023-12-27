import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITestsStudents } from '../tests-students.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tests-students.test-samples';

import { TestsStudentsService } from './tests-students.service';

const requireRestSample: ITestsStudents = {
  ...sampleWithRequiredData,
};

describe('TestsStudents Service', () => {
  let service: TestsStudentsService;
  let httpMock: HttpTestingController;
  let expectedResult: ITestsStudents | ITestsStudents[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TestsStudentsService);
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

    it('should create a TestsStudents', () => {
      const testsStudents = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(testsStudents).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TestsStudents', () => {
      const testsStudents = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(testsStudents).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TestsStudents', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TestsStudents', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TestsStudents', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTestsStudentsToCollectionIfMissing', () => {
      it('should add a TestsStudents to an empty array', () => {
        const testsStudents: ITestsStudents = sampleWithRequiredData;
        expectedResult = service.addTestsStudentsToCollectionIfMissing([], testsStudents);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(testsStudents);
      });

      it('should not add a TestsStudents to an array that contains it', () => {
        const testsStudents: ITestsStudents = sampleWithRequiredData;
        const testsStudentsCollection: ITestsStudents[] = [
          {
            ...testsStudents,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTestsStudentsToCollectionIfMissing(testsStudentsCollection, testsStudents);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TestsStudents to an array that doesn't contain it", () => {
        const testsStudents: ITestsStudents = sampleWithRequiredData;
        const testsStudentsCollection: ITestsStudents[] = [sampleWithPartialData];
        expectedResult = service.addTestsStudentsToCollectionIfMissing(testsStudentsCollection, testsStudents);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(testsStudents);
      });

      it('should add only unique TestsStudents to an array', () => {
        const testsStudentsArray: ITestsStudents[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const testsStudentsCollection: ITestsStudents[] = [sampleWithRequiredData];
        expectedResult = service.addTestsStudentsToCollectionIfMissing(testsStudentsCollection, ...testsStudentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const testsStudents: ITestsStudents = sampleWithRequiredData;
        const testsStudents2: ITestsStudents = sampleWithPartialData;
        expectedResult = service.addTestsStudentsToCollectionIfMissing([], testsStudents, testsStudents2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(testsStudents);
        expect(expectedResult).toContain(testsStudents2);
      });

      it('should accept null and undefined values', () => {
        const testsStudents: ITestsStudents = sampleWithRequiredData;
        expectedResult = service.addTestsStudentsToCollectionIfMissing([], null, testsStudents, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(testsStudents);
      });

      it('should return initial array if no TestsStudents is added', () => {
        const testsStudentsCollection: ITestsStudents[] = [sampleWithRequiredData];
        expectedResult = service.addTestsStudentsToCollectionIfMissing(testsStudentsCollection, undefined, null);
        expect(expectedResult).toEqual(testsStudentsCollection);
      });
    });

    describe('compareTestsStudents', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTestsStudents(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTestsStudents(entity1, entity2);
        const compareResult2 = service.compareTestsStudents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTestsStudents(entity1, entity2);
        const compareResult2 = service.compareTestsStudents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTestsStudents(entity1, entity2);
        const compareResult2 = service.compareTestsStudents(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
