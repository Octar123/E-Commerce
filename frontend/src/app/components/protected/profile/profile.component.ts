import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/AuthService/auth.service';
import { NotifyService } from '../../../services/NotifyService/notify.service';
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  profile: UserProfile = { name: '', email: '' };
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.error.set(null);
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profile = { name: data.name, email: data.email };
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load profile.');
        this.loading.set(false);
      },
    });
  }

  updateProfile(): void {
    this.saving.set(true);
    this.authService
      .updateProfile({ name: this.profile.name, email: this.profile.email })
      .subscribe({
        next: () => {
          this.saving.set(false);
        },
        error: () => {
          this.saving.set(false);
          this.notifyService.show('Failed to update profile', false);
        },
      });
  }

  changePassword(): void {
    if (!this.newPassword) {
      this.notifyService.show('Enter a new password', false);
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.notifyService.show('Passwords do not match', false);
      return;
    }

    this.authService.changePassword(this.newPassword).subscribe({
      next: () => {
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.notifyService.show('Failed to change password', false);
      },
    });
  }
}
