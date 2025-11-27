import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AccountStatus = 'none' | 'pending' | 'verified' | 'restricted' | 'action_required' | 'loading';

export interface AccountStatusConfig {
  status: AccountStatus;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
}

@Component({
  selector: 'app-account-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-status-badge.html',
  styleUrls: ['./account-status-badge.css']
})
export class AccountStatusBadgeComponent {
  @Input() status: AccountStatus = 'none';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showActions: boolean = false;
  @Input() clickable: boolean = false;
  @Input() requirementsCount: number = 0;

  @Output() onAction = new EventEmitter<string>();

  getStatusConfig() {
    const configs = {
      none: {
        label: 'Not Connected',
        icon: '⚪',
        description: 'Connect your bank account to receive payouts',
        actionText: 'Connect Now',
        class: 'status-none'
      },
      pending: {
        label: 'Pending Verification',
        icon: '⏳',
        description: 'Your account is being verified',
        actionText: 'Check Status',
        class: 'status-pending'
      },
      verified: {
        label: 'Verified',
        icon: '✓',
        description: 'Your account is active and ready',
        actionText: 'Manage Account',
        class: 'status-verified'
      },
      restricted: {
        label: 'Restricted',
        icon: '⚠️',
        description: 'Action required to enable payouts',
        actionText: 'Fix Issues',
        class: 'status-restricted'
      },
      action_required: {
        label: 'Action Required',
        icon: '❗',
        description: `${this.requirementsCount} item${this.requirementsCount !== 1 ? 's' : ''} need${this.requirementsCount === 1 ? 's' : ''} attention`,
        actionText: 'Complete Setup',
        class: 'status-action-required'
      },
      loading: {
        label: 'Checking...',
        icon: '⟳',
        description: 'Verifying account status',
        actionText: '',
        class: 'status-loading'
      }
    };

    return configs[this.status] || configs.none;
  }

  handleClick() {
    if (this.clickable) {
      this.onAction.emit('click');
    }
  }

  handleActionClick(event: Event) {
    event.stopPropagation();
    this.onAction.emit('action');
  }
}