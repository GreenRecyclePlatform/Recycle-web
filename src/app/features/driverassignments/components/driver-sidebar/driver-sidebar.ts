// driver-sidebar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  // Navigation items
  navItems: NavItem[] = [
    {
      icon: 'bi-truck',
      label: 'My Pickups',
      route: '/DashBoardDrivers',
    },
    {
      icon: 'bi-wallet2',
      label: 'Earnings',
      route: '/driver/earnings'
    },
    {
      icon: 'bi-person',
      label: 'Profile',
      route: '/DriverProfile'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.driverInitials || this.driverInitials === 'D') {
      this.driverInitials = this.getInitials(this.driverName);
    }
  }

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

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.includes(route);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getFormattedRating(): string {
    return this.driverRating ? this.driverRating.toFixed(1) : '0.0';
  }
}