import { Component, OnInit } from '@angular/core';
import { ResponseData } from '../../services/AuthService/auth.service';
import { NotifyService } from '../../services/NotifyService/notify.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notify',
  imports: [FormsModule, CommonModule],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css',
})
export class NotifyComponent implements OnInit {
  currentToast: ResponseData | null = null;

  constructor(private notifyService: NotifyService) {}

  ngOnInit() {
    this.notifyService.toastState.subscribe((state) => {
      this.currentToast = state;
    });
  }

  close() {
    this.currentToast = null;
  }
}
