import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { UserData } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, private isLoggedIn: IsLoggedInService) {}



  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (data) => {
        const user = (data.currentUser as UserData) || null;
        this.isLoggedIn.setUser(user);
        this.isLoggedIn.setInitialized(true);
        this.router.navigate(['']);
      },
      error: () => {
        // handle login error if needed
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  
}
