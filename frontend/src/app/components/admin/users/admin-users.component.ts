import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  AdminService,
  AdminUser,
} from '../../../services/AdminService/admin.service';
import { NotifyService } from '../../../services/NotifyService/notify.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(false);

  constructor(
    private adminService: AdminService,
    private notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(Array.isArray(users) ? users : []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifyService.show('Failed to load users', false);
      },
    });
  }

  lock(user: AdminUser): void {
    this.adminService.lockUser(user.id).subscribe({
      next: () => this.loadUsers(),
    });
  }

  unlock(user: AdminUser): void {
    this.adminService.unlockUser(user.id).subscribe({
      next: () => this.loadUsers(),
    });
  }
}
