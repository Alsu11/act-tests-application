import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 7876,
};

export const sampleWithPartialData: IStudent = {
  id: 18651,
  firstName: 'Vance',
  lastName: 'Schneider',
};

export const sampleWithFullData: IStudent = {
  id: 2970,
  firstName: 'Amara',
  lastName: 'Kirlin',
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
