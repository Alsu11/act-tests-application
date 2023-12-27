import { IQuestion, NewQuestion } from './question.model';

export const sampleWithRequiredData: IQuestion = {
  id: 17312,
};

export const sampleWithPartialData: IQuestion = {
  id: 20314,
  points: 'ew including type',
};

export const sampleWithFullData: IQuestion = {
  id: 14,
  question: 'mollify',
  answers: 'now research deliberately',
  points: 'reformat till',
};

export const sampleWithNewData: NewQuestion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
