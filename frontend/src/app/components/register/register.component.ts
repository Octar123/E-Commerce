import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
  };

  showPassword = false;

  onSubmit() {
    console.log('Attempting login with:', this.registerData);
    // Add your authentication logic here
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
