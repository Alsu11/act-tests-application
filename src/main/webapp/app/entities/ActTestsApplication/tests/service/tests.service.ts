import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITests, NewTests } from '../tests.model';

export type PartialUpdateTests = Partial<ITests> & Pick<ITests, 'id'>;

export type EntityResponseType = HttpResponse<ITests>;
export type EntityArrayResponseType = HttpResponse<ITests[]>;

@Injectable({ providedIn: 'root' })
export class TestsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tests', 'acttestsapplication');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(tests: NewTests): Observable<EntityResponseType> {
    return this.http.post<ITests>(this.resourceUrl, tests, { observe: 'response' });
  }

  update(tests: ITests): Observable<EntityResponseType> {
    return this.http.put<ITests>(`${this.resourceUrl}/${this.getTestsIdentifier(tests)}`, tests, { observe: 'response' });
  }

  partialUpdate(tests: PartialUpdateTests): Observable<EntityResponseType> {
    return this.http.patch<ITests>(`${this.resourceUrl}/${this.getTestsIdentifier(tests)}`, tests, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITests>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITests[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTestsIdentifier(tests: Pick<ITests, 'id'>): number {
    return tests.id;
  }

  compareTests(o1: Pick<ITests, 'id'> | null, o2: Pick<ITests, 'id'> | null): boolean {
    return o1 && o2 ? this.getTestsIdentifier(o1) === this.getTestsIdentifier(o2) : o1 === o2;
  }

  addTestsToCollectionIfMissing<Type extends Pick<ITests, 'id'>>(
    testsCollection: Type[],
    ...testsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tests: Type[] = testsToCheck.filter(isPresent);
    if (tests.length > 0) {
      const testsCollectionIdentifiers = testsCollection.map(testsItem => this.getTestsIdentifier(testsItem)!);
      const testsToAdd = tests.filter(testsItem => {
        const testsIdentifier = this.getTestsIdentifier(testsItem);
        if (testsCollectionIdentifiers.includes(testsIdentifier)) {
          return false;
        }
        testsCollectionIdentifiers.push(testsIdentifier);
        return true;
      });
      return [...testsToAdd, ...testsCollection];
    }
    return testsCollection;
  }
}
