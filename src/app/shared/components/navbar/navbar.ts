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

  scrollToSection(sectionId: string): void {
    // If we're not on the home page, navigate to it first
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 100);
      });
    } else {
      // Already on home page, just scroll
      this.performScroll(sectionId);
    }
  }

  private performScroll(sectionId: string): void {
    if (sectionId === 'top') {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to specific section
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll with offset for sticky navbar (64px height)
        const navbarHeight = 64;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}
