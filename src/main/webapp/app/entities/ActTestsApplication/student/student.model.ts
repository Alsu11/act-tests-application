export interface IStudent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
