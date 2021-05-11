import { Injectable } from '@angular/core';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {
  currentFilter: any;

  constructor() {}

  downloadPDFFromHTML(element: Element, fileName: string) {
    const options = {
      margin: 1,
      filename: fileName,
      html2canvas: {
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'cm',
        format: 'a4',
        orientation: 'landscape',
      },
    };
    html2pdf().set(options).from(element).save();
    // html2pdf(element, options);
  }
}
