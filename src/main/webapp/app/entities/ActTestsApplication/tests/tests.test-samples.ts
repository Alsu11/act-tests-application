import { ITests, NewTests } from './tests.model';

export const sampleWithRequiredData: ITests = {
  id: 13760,
};

export const sampleWithPartialData: ITests = {
  id: 31876,
  subject: 'auction reprint',
};

export const sampleWithFullData: ITests = {
  id: 16139,
  subject: 'uh-huh illiterate monthly',
};

export const sampleWithNewData: NewTests = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
