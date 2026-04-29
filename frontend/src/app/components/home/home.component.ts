import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  categories = [
    {
      name: 'Electronics',
      image: 'assets/electronics.jpg',
      count: '120+ Items',
    },
    { name: 'Fashion', image: 'assets/fashion.jpg', count: '340+ Items' },
    { name: 'Home Decor', image: 'assets/home.jpg', count: '80+ Items' },
  ];

  trendingProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      rating: 4.8,
      img: 'assets/p1.jpg',
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      price: 249.99,
      rating: 4.9,
      img: 'assets/p2.jpg',
    },
    {
      id: 3,
      name: 'Minimalist Backpack',
      price: 55.0,
      rating: 4.5,
      img: 'assets/p3.jpg',
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      price: 120.0,
      rating: 4.7,
      img: 'assets/p4.jpg',
    },
  ];
}
