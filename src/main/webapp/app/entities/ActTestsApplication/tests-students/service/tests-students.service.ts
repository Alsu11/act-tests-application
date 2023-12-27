import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITestsStudents, NewTestsStudents } from '../tests-students.model';

export type PartialUpdateTestsStudents = Partial<ITestsStudents> & Pick<ITestsStudents, 'id'>;

export type EntityResponseType = HttpResponse<ITestsStudents>;
export type EntityArrayResponseType = HttpResponse<ITestsStudents[]>;

@Injectable({ providedIn: 'root' })
export class TestsStudentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tests-students', 'acttestsapplication');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(testsStudents: NewTestsStudents): Observable<EntityResponseType> {
    return this.http.post<ITestsStudents>(this.resourceUrl, testsStudents, { observe: 'response' });
  }

  update(testsStudents: ITestsStudents): Observable<EntityResponseType> {
    return this.http.put<ITestsStudents>(`${this.resourceUrl}/${this.getTestsStudentsIdentifier(testsStudents)}`, testsStudents, {
      observe: 'response',
    });
  }

  partialUpdate(testsStudents: PartialUpdateTestsStudents): Observable<EntityResponseType> {
    return this.http.patch<ITestsStudents>(`${this.resourceUrl}/${this.getTestsStudentsIdentifier(testsStudents)}`, testsStudents, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITestsStudents>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITestsStudents[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTestsStudentsIdentifier(testsStudents: Pick<ITestsStudents, 'id'>): number {
    return testsStudents.id;
  }

  compareTestsStudents(o1: Pick<ITestsStudents, 'id'> | null, o2: Pick<ITestsStudents, 'id'> | null): boolean {
    return o1 && o2 ? this.getTestsStudentsIdentifier(o1) === this.getTestsStudentsIdentifier(o2) : o1 === o2;
  }

  addTestsStudentsToCollectionIfMissing<Type extends Pick<ITestsStudents, 'id'>>(
    testsStudentsCollection: Type[],
    ...testsStudentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const testsStudents: Type[] = testsStudentsToCheck.filter(isPresent);
    if (testsStudents.length > 0) {
      const testsStudentsCollectionIdentifiers = testsStudentsCollection.map(
        testsStudentsItem => this.getTestsStudentsIdentifier(testsStudentsItem)!,
      );
      const testsStudentsToAdd = testsStudents.filter(testsStudentsItem => {
        const testsStudentsIdentifier = this.getTestsStudentsIdentifier(testsStudentsItem);
        if (testsStudentsCollectionIdentifiers.includes(testsStudentsIdentifier)) {
          return false;
        }
        testsStudentsCollectionIdentifiers.push(testsStudentsIdentifier);
        return true;
      });
      return [...testsStudentsToAdd, ...testsStudentsCollection];
    }
    return testsStudentsCollection;
  }
}
