import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}



  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        // AuthService sets the shared user state; just navigate on success
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
