import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements ICellRendererAngularComp, OnInit {
  imageUrl: string;
  private data: ICellRendererParams;
  openImg: boolean = false;
  private params: ICellRendererParams;
  constructor() {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.imageUrl = params.data.image;
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  showImg() {
    this.openImg = !this.openImg;
    this.params.context.parentComponent.showImg(this.imageUrl);
  }
}
