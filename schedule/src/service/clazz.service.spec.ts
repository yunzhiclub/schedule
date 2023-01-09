import { TestBed } from '@angular/core/testing';

import { ClazzService } from './clazz.service';
import {TestModule} from '../app/test/test.module';

describe('ClazzService', () => {
  let service: ClazzService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ]
    });
    service = TestBed.inject(ClazzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
