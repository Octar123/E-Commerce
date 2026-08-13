import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  constructor(
    public authState: IsLoggedInService,
    private router: Router,
    private authService: AuthService,
  ) {}

  toggleLogin(): void {
    this.router.navigate(['/login']);
  }

  toggleLogout(): void {
    this.authService.logout().subscribe();
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }

  navigateCart(): void {
    this.router.navigate(['/cart']);
  }
}
