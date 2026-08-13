import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth.service';
import { NotifyService } from '../../services/NotifyService/notify.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  code = '';
  password = '';
  mockOtp = signal<string | null>(null);
  step = signal<'request' | 'reset'>('request');
  submitting = signal(false);

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private router: Router,
  ) {}

  requestOtp(): void {
    if (!this.email) {
      return;
    }
    this.submitting.set(true);
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.mockOtp.set(res.code ?? null);
        this.step.set('reset');
      },
      error: () => {
        this.submitting.set(false);
        this.notifyService.show('Could not send OTP', false);
      },
    });
  }

  resetPassword(): void {
    if (!this.code || !this.password) {
      return;
    }
    this.submitting.set(true);
    this.authService
      .resetPassword({
        email: this.email,
        code: this.code,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/login']);
        },
        error: () => {
          this.submitting.set(false);
          this.notifyService.show('Could not reset password', false);
        },
      });
  }
}
