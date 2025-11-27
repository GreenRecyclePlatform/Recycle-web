import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Leaf, Bell, User, LogOut, Menu } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <!-- Logo -->
          <a routerLink="/" class="logo">
            <div class="logo-icon">
              <lucide-icon [img]="LeafIcon" [size]="24"></lucide-icon>
            </div>
            <span class="logo-text">RecycleHub</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="nav-links">
            <a routerLink="/" class="nav-link">Home</a>
            <a routerLink="/" fragment="how-it-works" class="nav-link">How It Works</a>
            <a routerLink="/" fragment="materials" class="nav-link">Materials</a>
            <a routerLink="/" fragment="contact" class="nav-link">Contact</a>
          </div>

          <!-- Right side actions -->
          <div class="nav-actions">
            @if (isAuthenticated()) {
              <!-- Notifications -->
              <button class="icon-button">
                <lucide-icon [img]="BellIcon" [size]="20"></lucide-icon>
                @if (unreadCount > 0) {
                  <span class="badge">{{ unreadCount }}</span>
                }
              </button>

              <!-- User Menu -->
              <div class="user-menu">
                <button class="user-button" (click)="toggleUserMenu()">
                  <div class="user-avatar">
                    {{ userName().charAt(0) }}
                  </div>
                  <span class="user-name">{{ userName() }}</span>
                </button>

                @if (showUserMenu) {
                  <div class="user-dropdown">
                    <div class="user-role">{{ userRole() }}</div>
                    <div class="divider"></div>
                    <button class="menu-item" (click)="navigateToAdmin()">
                      <lucide-icon [img]="UserIcon" [size]="16"></lucide-icon>
                      Dashboard
                    </button>
                    <button class="menu-item" (click)="logout()">
                      <lucide-icon [img]="LogOutIcon" [size]="16"></lucide-icon>
                      Logout
                    </button>
                  </div>
                }
              </div>
            } @else {
              <button class="btn-text" (click)="navigateTo('/login')">Login</button>
              <button class="btn-primary" (click)="navigateTo('/register')">
                Get Started
              </button>
            }

            <!-- Mobile menu button -->
            <button class="mobile-menu-button" (click)="toggleMobileMenu()">
              <lucide-icon [img]="MenuIcon" [size]="24"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (showMobileMenu) {
        <div class="mobile-menu">
          <a routerLink="/" class="mobile-link" (click)="closeMobileMenu()">Home</a>
          <a routerLink="/" fragment="how-it-works" class="mobile-link" (click)="closeMobileMenu()">How It Works</a>
          <a routerLink="/" fragment="materials" class="mobile-link" (click)="closeMobileMenu()">Materials</a>
          <a routerLink="/" fragment="contact" class="mobile-link" (click)="closeMobileMenu()">Contact</a>
          @if (!isAuthenticated()) {
            <button class="btn-text mobile-btn" (click)="navigateTo('/login'); closeMobileMenu()">Login</button>
            <button class="btn-primary mobile-btn" (click)="navigateTo('/register'); closeMobileMenu()">
              Get Started
            </button>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: white;
      border-bottom: 1px solid var(--border);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--primary-green);
    }

    .logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--primary-green);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--dark-gray);
    }

    .nav-links {
      display: none;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-link {
      text-decoration: none;
      color: var(--dark-gray);
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: var(--primary-green);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-button {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }

    .icon-button:hover {
      background: var(--light-gray);
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--accent-blue);
      color: white;
      border-radius: 9999px;
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }

    .user-button:hover {
      background: var(--light-gray);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      background: var(--primary-green);
      color: white;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-name {
      display: none;
    }

    @media (min-width: 768px) {
      .user-name {
        display: inline;
      }
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 12rem;
      z-index: 50;
    }

    .user-role {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: capitalize;
    }

    .divider {
      height: 1px;
      background: var(--border);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s;
    }

    .menu-item:hover {
      background: var(--light-gray);
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--dark-gray);
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-weight: 500;
      display: none;
    }

    .btn-primary {
      background: var(--primary-green);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
      display: none;
    }

    .btn-primary:hover {
      background: var(--primary-green-dark);
    }

    @media (min-width: 768px) {
      .btn-text,
      .btn-primary {
        display: inline-block;
      }
    }

    .mobile-menu-button {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    @media (min-width: 768px) {
      .mobile-menu-button {
        display: none;
      }
    }

    .mobile-menu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-top: 1px solid var(--border);
    }

    @media (min-width: 768px) {
      .mobile-menu {
        display: none;
      }
    }

    .mobile-link {
      text-decoration: none;
      color: var(--dark-gray);
      padding: 0.5rem;
      font-size: 1.125rem;
    }

    .mobile-btn {
      display: block !important;
      width: 100%;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Icons
  LeafIcon = Leaf;
  BellIcon = Bell;
  UserIcon = User;
  LogOutIcon = LogOut;
  MenuIcon = Menu;

  showUserMenu = false;
  showMobileMenu = false;
  unreadCount = 2;

  isAuthenticated = this.authService.currentUser;

  userName() {
    return this.authService.currentUser()?.name || 'User';
  }

  userRole() {
    return this.authService.currentUser()?.role || 'user';
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  navigateToAdmin() {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/inventory']);
    }
    this.showUserMenu = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showUserMenu = false;
  }
}
