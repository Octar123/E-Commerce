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
    // Add your authentication logic here
    this.authService.login(this.loginData).subscribe(data => {
      this.router.navigate(['']);
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  
}
