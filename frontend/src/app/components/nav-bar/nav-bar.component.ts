import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { UserData } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent{

  constructor(public isLoggenIn: IsLoggedInService, private router: Router) {}
  
  toogleLogin() {
    this.router.navigate(['/login']);
  }
  
}
