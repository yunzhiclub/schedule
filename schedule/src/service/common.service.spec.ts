import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import {TestModule} from '../app/test/test.module';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ]
    });
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
