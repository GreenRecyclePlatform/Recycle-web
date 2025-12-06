import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/authservice';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
//implements OnInit
export class AdminSidebarComponent {
  adminName: string = 'Admin User';
  adminRole: string = 'Admin';
 // notificationCount: number = 8;

  constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   const user = this.authService.currentUser();
  //   if (user) {
  //     this.adminName = user.name;
  //     this.adminRole = user.role;
  //   }
  // }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
