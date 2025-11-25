import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, Leaf, Bell, Menu, User, LogOut } from 'lucide-angular';
import { AuthService } from '../../../core/services/authservice';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule, RouterModule, CommonModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  isAuthenticated!: boolean;
  @Input() transparent = false;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  Leaf = Leaf;
  Bell = Bell;
  Menu = Menu;
  User = User;
  LogOut = LogOut;

  logout() {
    this.authService.logout();
  }

  mobileMenuOpen: any;

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
