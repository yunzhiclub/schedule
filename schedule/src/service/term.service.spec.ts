import { TestBed } from '@angular/core/testing';

import { TermService } from './term.service';
import {TestModule} from '../app/test/test.module';

describe('TermService', () => {
  let service: TermService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ]
    });
    service = TestBed.inject(TermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
