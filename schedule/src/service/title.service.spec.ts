import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';
import {TestModule} from '../app/test/test.module';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ]
    });
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
