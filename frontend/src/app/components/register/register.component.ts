import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  registerData = {
    name: '',
    email: '',
    password: '',
  };

  showPassword = false;
  isSubmitting = false;

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
