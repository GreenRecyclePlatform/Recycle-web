import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <!-- Navbar Placeholder -->
      <div class="navbar-placeholder">
        <div class="navbar-content">
          <div class="app-logo">
            <span class="logo-icon">♻️</span>
            <span class="logo-text">RecycleHub</span>
          </div>
          <div class="navbar-actions">
            <button class="notification-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Container -->
      <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="admin-profile">
              <div class="admin-avatar">{{ adminName.charAt(0) }}</div>
              <div class="admin-info">
                <h3 class="admin-name">{{ adminName }}</h3>
                <span class="admin-badge">{{ adminRole }}</span>
              </div>
            </div>
          </div>

          <nav class="sidebar-nav">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/admin/review-requests" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>Review Requests</span>
              <span class="badge-notification" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
            </a>

            <a routerLink="/admin/assign-drivers" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Assign Drivers</span>
            </a>

            <a routerLink="/admin/manage-materials" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span>Manage Materials</span>
            </a>

            <a routerLink="/admin/inventory" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span>Inventory</span>
            </a>

            <a routerLink="/admin/drivers" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Drivers</span>
            </a>

            <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Reports</span>
            </a>

            <a routerLink="/admin/settings" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
              </svg>
              <span>Settings</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <button class="logout-btn" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
            <p class="copyright">© 2025 RecycleHub</p>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background-color: #F8F9FA;
      display: flex;
      flex-direction: column;
    }

    .navbar-placeholder {
      min-height: 64px;
      background: white;
      border-bottom: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      height: 64px;
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      font-size: 1.75rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2D6A4F;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notification-btn {
      position: relative;
      background: transparent;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .notification-btn:hover {
      background-color: #f8f9fa;
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #dc3545;
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      padding: 2px 5px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .admin-container {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 64px);
    }

    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .admin-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .admin-avatar {
      width: 48px;
      height: 48px;
      background-color: #2D6A4F;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .admin-info {
      flex: 1;
    }

    .admin-name {
      font-size: 1rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 0.25rem 0;
    }

    .admin-badge {
      display: inline-block;
      background-color: #e9d5ff;
      color: #7c3aed;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #495057;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      position: relative;
    }

    .nav-item:hover {
      background-color: #f8f9fa;
      color: #2D6A4F;
    }

    .nav-item.active {
      background-color: #2D6A4F;
      color: white;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #1e4d37;
    }

    .badge-notification {
      margin-left: auto;
      background-color: #0077B6;
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }

    .nav-item.active .badge-notification {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      color: #495057;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background-color: #f8f9fa;
      border-color: #adb5bd;
      color: #dc3545;
    }

    .copyright {
      text-align: center;
      color: #adb5bd;
      font-size: 0.75rem;
      margin-top: 0.75rem;
      margin-bottom: 0;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-x: hidden;
      min-width: 0;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -260px;
        top: 64px;
        z-index: 99;
        transition: left 0.3s ease;
        height: calc(100vh - 64px);
      }

      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  adminName: string = 'Admin User';
  adminRole: string = 'Admin';
  notificationCount: number = 8;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // You can load user data from AuthService here
  }

  logout(): void {
    // Clear any stored authentication data
    // If you're using AuthService, call it here:
    // this.authService.logout();

    // Redirect to landing page
    this.router.navigate(['/']);
  }
}
