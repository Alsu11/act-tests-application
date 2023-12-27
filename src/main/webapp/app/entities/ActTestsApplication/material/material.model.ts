export interface IMaterial {
  id: number;
  topic?: string | null;
  link?: string | null;
}

export type NewMaterial = Omit<IMaterial, 'id'> & { id: null };
