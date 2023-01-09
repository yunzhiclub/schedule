import { TestBed } from '@angular/core/testing';

import { StudentService } from './student.service';
import {TestModule} from '../app/test/test.module';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      TestModule
    ]
    });
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
