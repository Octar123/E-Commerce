import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotifyComponent } from './components/notify/notify.component';
import { AuthService } from './services/AuthService/auth.service';
import { UserData } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, NotifyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Populate shared auth state on startup
    this.authService.loadCurrentUser().subscribe();
  }
}
