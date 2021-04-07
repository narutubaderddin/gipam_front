import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-administrator-home-page',
  templateUrl: './administrator-home-page.component.html',
  styleUrls: ['./administrator-home-page.component.scss'],
})
export class AdministratorHomePageComponent implements OnInit {
  imageObject: Array<object> = [
    {
      image: 'assets/images/1.jpg',
      thumbImage: 'assets/images/1.jpg',
      alt: 'alt of image',
      title: 'title of image',
    },
    {
      image: 'assets/images/2.jpg',
      thumbImage: 'assets/images/2.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/9.jpg',
      thumbImage: 'assets/images/9.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/4.jpg',
      thumbImage: 'assets/images/4.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/12.jpg',
      thumbImage: 'assets/images/12.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
  ];

  page = 1;
  constructor() {}
  ngOnInit(): void {}
}
