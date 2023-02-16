import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Attachment} from './../entity/attachment';
import {XAuthTokenInterceptor} from '../app/interceptor/x-auth-token.interceptor';
import {ApiPrefixAndMergeMapInterceptor} from '../app/interceptor/api-prefix-and-merge-map.interceptor';

@Injectable({
  providedIn: 'root'
})
/**
 * 附件对应的M层
 */
export class AttachmentService {

  private url = 'attachment';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 数据导出
   * @param attachment 单个导出的附件
   * @param filename 保存的文件名
   */
  download(attachment: Attachment, filename: string): void {
    const url = `${this.url}/download/${attachment.id}/${attachment.file?.md5}`;
    return this.downloadByFilenameAndUrl(filename, url);
  }

  /**
   * 指定文件名及下载的url
   * @param filename 文件名
   * @param url 下载url
   */
  downloadByFilenameAndUrl(filename: string, url: string): void {
    console.log(filename);
    const link = document.createElement('a');
    link.setAttribute('href', ApiPrefixAndMergeMapInterceptor.getApiUrl(url)
      + '?x-auth-token=' + XAuthTokenInterceptor.getToken()
      + '&filename=' + filename);
    link.setAttribute('target', '_blank');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 上传文件
   * @param file 文件
   */
  upload(file: File): Observable<HttpEvent<object>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.url}/upload`,
      formData, {reportProgress: true, observe: 'events'});
  }
}
