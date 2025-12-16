import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutsModule } from '../layouts.module';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css'],
  imports: [CommonModule, Navbar, RouterModule]
})
export class UserLayoutComponent implements OnInit {
  userName: string = 'User';
  userRole: string = 'Member';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Get user info from localStorage or auth service
    const storedUser = localStorage.getItem('userName');
    if (storedUser) {
      this.userName = storedUser;
    }
  }

  logout(): void {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    // Navigate to login
    this.router.navigate(['/auth/login']);
  }
}