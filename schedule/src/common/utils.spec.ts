import {TestBed} from '@angular/core/testing';
import {dateStringToTimestamp, Utils} from './utils';
import {HttpParams} from '@angular/common/http';
import {of} from 'rxjs';
import {concat, concatMap, delay, last, map, mergeAll, tap} from 'rxjs/operators';

describe('utils', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: []
  }));

  it('convertToLoadingFormat', () => {
    expect(Utils.convertToLoadingFormat('请稍候')).toEqual('请稍候.');
    expect(Utils.convertToLoadingFormat('请稍候.')).toEqual('请稍候..');
    expect(Utils.convertToLoadingFormat('请稍候..')).toEqual('请稍候...');
    expect(Utils.convertToLoadingFormat('请稍候...')).toEqual('请稍候');
  });

  it('parseInt', () => {
    expect(Number.parseInt('123', 10)).toBe(123);
    expect(Number.isNaN(Number.parseInt('abc', 10))).toBeTrue();
  });

  it('测试HttpParams对null及undefined的处理', () => {
    let httpParams = new HttpParams().append('name', '');
    expect(httpParams.has('name')).toBeTrue();
    httpParams = new HttpParams().append('test', '');
    expect(httpParams.has('test')).toBeTrue();
    expect(httpParams.has('test1')).toBeFalse();
  });

  it('rxjs concatMap测试', (done) => {
    const a = of(1, 2).pipe(delay(500));
    a.pipe(tap(t => console.log(t)),
      concatMap(a1 => {
        if (a1 === 1) {
          return of('2', '3', '4');
        } else {
          return of(7, 8, 9);
        }
      }),
      last())
      .subscribe(r => {
          expect(r).toBe(9);
        }, error => {
        }, () => done()
      );
  });

  it('dateStringToTimestamp', () => {
    expect(dateStringToTimestamp('2021-05-04')).toEqual(1620057600000);
  });

  it('fileSize', () => {
    expect(Utils.fileSize(100)).toEqual('100B');
    expect(Utils.fileSize(100.01212 * 1024)).toEqual('100KB');
    expect(Utils.fileSize(100.0123123 * 1024 * 1024)).toEqual('100MB');
    expect(Utils.fileSize(100.0123123123123 * 1024 * 1024 * 1024)).toEqual('100GB');
    expect(Utils.fileSize(100.012312312312323 * 1024 * 1024 * 1024 * 1024)).toEqual('100TB');
  });
});
