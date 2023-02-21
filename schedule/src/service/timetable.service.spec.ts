import { TestBed } from '@angular/core/testing';

import { TimetableService } from './timetable.service';
import {TestModule} from '../app/test/test.module';

describe('TimetableService', () => {
  let service: TimetableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ]
    });
    service = TestBed.inject(TimetableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
