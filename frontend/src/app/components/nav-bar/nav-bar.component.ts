import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { UserData } from '../../app.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent{

  constructor(public isLoggenIn: IsLoggedInService, private router: Router, private authService: AuthService) {}
  
  toogleLogin() {
    this.router.navigate(['/login']);
  }

  toogleLogout() {
    this.authService.logout().subscribe({
      next: data => {
        this.isLoggenIn.isLoggedIn.next(null);
      }
    })
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }
  
}
