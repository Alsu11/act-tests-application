import { ITestsStudents, NewTestsStudents } from './tests-students.model';

export const sampleWithRequiredData: ITestsStudents = {
  id: 880,
};

export const sampleWithPartialData: ITestsStudents = {
  id: 13807,
};

export const sampleWithFullData: ITestsStudents = {
  id: 30797,
  result: 'seldom',
};

export const sampleWithNewData: NewTestsStudents = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
