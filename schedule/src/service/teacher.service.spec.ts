import { TestBed } from '@angular/core/testing';

import { TeacherService } from './teacher.service';
import {TestModule} from '../app/test/test.module';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      TestModule
    ]
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
