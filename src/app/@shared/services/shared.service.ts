import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class SharedService {
  constructor(private http: HttpClient) {}

  /**
   * Transform date string to a DateTimeFormat
   */
  stringToDate(date: string, format: string = 'dd/MM/yyyy', delimiter: string = '/'): Date {
    const formatLowerCase = format.toLowerCase();
    const formatItems = formatLowerCase.split(delimiter);
    const dateItems = date.split(delimiter).map((item) => Number(item));
    const monthIndex = formatItems.indexOf('mm');
    const dayIndex = formatItems.indexOf('dd');
    const yearIndex = formatItems.indexOf('yyyy');
    const month = dateItems[monthIndex] - 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
  }

  /**
   * Transform a DateTimeFormat to a date string
   */
  dateToString(date: Date, local: string = 'fr') {
    if (date != null) {
      return moment(date).utc(true).format('DD/MM/YYYY');
    }
  }
  formatDate(date: string) {
    return moment(date).utc(false).format('DD/MM/YYYY');
  }
  ngbDateFromDate(date: Date): NgbDate {
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  dateTimeformat(date: Date): string {
    return this.dateToString(date) + ' ' + date.toLocaleTimeString();
  }

  NgbDateToString(date: NgbDate): string {
    return date.year + '-' + date.month + '-' + date.day;
  }

  stringToNgbDate(date: string): NgbDate {
    const dateItems = date.split('-').map((item) => Number(item));
    return new NgbDate(dateItems[0], dateItems[1], dateItems[2]);
  }

  manageFileResponseDownload(response: Response | any) {
    const newBlob = new Blob([response.body], {
      type: response.body.type,
    });
    // file name
    let fileName = 'test.xlsx';
    if (response.headers.get('Content-Disposition')) {
      fileName = response.headers.get('Content-Disposition').split('=')[1];
    }

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  getMonthFirstDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth());
  }

  getMonthLastDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
}
