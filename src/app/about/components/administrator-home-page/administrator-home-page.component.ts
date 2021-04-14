import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}
  ngOnInit(): void {}

  onNoticeClick() {
    this.router.navigate(['notices-list'], { queryParams: { filter: 'en-cours' } });
  }

  onRecolementClick() {
    this.router.navigate(['recolements-list'], { queryParams: { filter: 'en-cours' } });
  }
  onAlertClick() {
    this.router.navigate(['alerts-list'], { queryParams: { filter: 'en-cours' } });
  }
}
