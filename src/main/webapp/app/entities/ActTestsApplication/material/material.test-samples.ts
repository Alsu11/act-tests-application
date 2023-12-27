import { IMaterial, NewMaterial } from './material.model';

export const sampleWithRequiredData: IMaterial = {
  id: 19558,
};

export const sampleWithPartialData: IMaterial = {
  id: 31689,
  topic: 'wearily',
  link: 'immunize',
};

export const sampleWithFullData: IMaterial = {
  id: 4520,
  topic: 'classic admonish',
  link: 'vaporize awkward',
};

export const sampleWithNewData: NewMaterial = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
