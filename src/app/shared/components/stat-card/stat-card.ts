import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="stat-card" [style.border-color]="color">
      <div class="stat-header">
        <div class="stat-icon" [style.background-color]="color + '20'" [style.color]="color">
          <lucide-icon [img]="icon" [size]="24"></lucide-icon>
        </div>
        @if (trend) {
          <div class="stat-trend" [class.positive]="trend.isPositive">
            {{ trend.isPositive ? '+' : '' }}{{ trend.value }}%
          </div>
        }
      </div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-title">{{ title }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 0.5rem;
      border: 2px solid;
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-trend {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: #10b981;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--dark-gray);
      margin-bottom: 0.25rem;
    }

    .stat-title {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() icon!: any;
  @Input() color: string = '#0077B6';
  @Input() trend?: { value: number; isPositive: boolean };
}
