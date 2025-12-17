// driver-sidebar.component.ts
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/authservice';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-driver-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-sidebar.html',
  styleUrls: ['./driver-sidebar.css']
})
export class DriverSidebar implements OnInit {
  @Input() driverName: string = 'Driver';
  @Input() driverRole: string = 'Driver';
  @Input() driverImage: string | null = null;
  @Input() driverRating: number = 0;
  @Input() driverInitials: string = 'D';

  // Mobile sidebar state
  isSidebarOpen = false;

  // Navigation items
  navItems: NavItem[] = [
    {
      icon: 'bi-truck',
      label: 'My Pickups',
      route: 'driver/DashBoardDrivers',
    },
    // Uncomment to add earnings section
    // {
    //   icon: 'bi-wallet2',
    //   label: 'Earnings',
    //   route: '/driver/earnings'
    // },
    {
      icon: 'bi-person',
      label: 'Profile',
      route: 'driver/DriverProfile'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Generate initials if not provided
    if (!this.driverInitials || this.driverInitials === 'D') {
      this.driverInitials = this.getInitials(this.driverName);
    }
  }

  /**
   * Generate initials from driver name
   * @param name - Full name of the driver
   * @returns Initials (max 2 characters)
   */
  getInitials(name: string): string {
    if (!name || name === 'Driver') return 'D';

    return name
      .trim()
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * Check if a route is currently active
   * @param route - Route to check
   * @returns true if route is active
   */
  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.includes(route);
  }

  /**
   * Navigate to a specific route and close sidebar on mobile
   * @param route - Route to navigate to
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeSidebarOnMobile();
  }

  /**
   * Get formatted rating string
   * @returns Formatted rating (e.g., "4.5")
   */
  getFormattedRating(): string {
    return this.driverRating ? this.driverRating.toFixed(1) : '0.0';
  }

  /**
   * Toggle sidebar for mobile view
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Close sidebar when nav item is clicked on mobile
   */
  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Close sidebar when window is resized to desktop
   * @param event - Resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 768) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Logout and navigate to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
