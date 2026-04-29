import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tap } from 'rxjs';
import { IsLoggedInService } from './shared/is-logged-in.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotifyComponent } from "./components/notify/notify.component";

export interface UserData {
  id: string;
  role: string;
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, NotifyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private isLoggedIn: IsLoggedInService) {}

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    this.http.get<any>('http://localhost:3001/me').subscribe({
      next: (response) => {
        this.isLoggedIn.isLoggedIn.next(response.currentUser || null);
      },
      error: (err) => {
        this.isLoggedIn.isLoggedIn.next(null);
      }
    })
  }
}
