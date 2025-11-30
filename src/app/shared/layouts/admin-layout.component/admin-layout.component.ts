import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  adminName: string = 'Admin User';
  adminRole: string = 'Admin';
  notificationCount: number = 8;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load user data from AuthService here if needed
  }

  logout(): void {
    // Clear authentication and redirect
    this.router.navigate(['/']);
  }
}
