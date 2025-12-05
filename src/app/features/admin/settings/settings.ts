import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar';
import { SettingService } from '../../../core/services/setting.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar,AdminSidebarComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  activeTab: string = 'platform';
  isLoading: boolean = false;
  isSaving: boolean = false;

  // Platform Settings
  platformSettings = {
    platformName: 'RecycleHub',
    platformEmail: 'support@recyclehub.com',
    platformPhone: '+91 22 1234 5678',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en'
  };

  // Pricing Settings
  pricingSettings = {
    plasticPrice: 25,
    paperPrice: 18,
    cardboardPrice: 22,
    electronicsPrice: 48,
    metalsPrice: 40,
    glassPrice: 15,
    commissionRate: 10,
    minimumOrderValue: 500
  };

  // Notification Settings
  notificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newRequestAlert: true,
    pickupCompleteAlert: true,
    lowInventoryAlert: true,
    newOrderAlert: true
  };

  // Operational Settings
  operationalSettings = {
    autoApproveRequests: false,
    autoAssignDrivers: false,
    workingHoursStart: '08:00',
    workingHoursEnd: '20:00',
    maxPickupsPerDriver: 10,
    pickupSlotDuration: 120,
    minimumPickupWeight: 5
  };

  // Payment Settings
  paymentSettings = {
    paymentCycle: 'weekly',
    paymentMethod: 'bank-transfer',
    paymentGatewayFee: 2.5,
    processingTime: 3
  };

  timezones = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo (EET)' }
  ];

  currencies = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'EGP', label: 'EGP (E£)' }
  ];

  languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ar', label: 'Arabic (العربية)' }
  ];

  paymentCycles = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  paymentMethods = [
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  constructor(private settingservice: SettingService) {}

  ngOnInit(): void {
    this.loadAllSettings();
  }

  loadAllSettings(): void {
    this.isLoading = true;

    this.settingservice.getAllSettings().subscribe({
      next: (data) => {
        // Map backend data to component properties
        if (data.platform) {
          this.mapSettingsToObject(data.platform, this.platformSettings);
        }
        if (data.pricing) {
          this.mapSettingsToObject(data.pricing, this.pricingSettings);
        }
        if (data.notification) {
          this.mapSettingsToObject(data.notification, this.notificationSettings);
        }
        if (data.operational) {
          this.mapSettingsToObject(data.operational, this.operationalSettings);
        }
        if (data.payment) {
          this.mapSettingsToObject(data.payment, this.paymentSettings);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.isLoading = false;
        // Keep default values if loading fails
      }
    });
  }

private mapSettingsToObject(source: { [key: string]: string }, target: any): void {
  Object.keys(target).forEach(key => {
    if (source[key] !== undefined) {
      const value = source[key];

      // Type conversion based on target type
      if (typeof target[key] === 'boolean') {
        // Properly convert string to boolean
        target[key] = value === 'true';
      } else if (typeof target[key] === 'number') {
        target[key] = parseFloat(value) || 0;
      } else {
        target[key] = value;
      }
    }
  });
}
private objectToSettingsMap(obj: any): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  Object.keys(obj).forEach(key => {
    result[key] = String(obj[key]);
  });

  return result;
}
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleSaveSettings(section: string): void {
    this.isSaving = true;

    let category = '';
    let settings: any = {};

    // Map section name to category and settings object
    switch(section.toLowerCase()) {
      case 'platform':
        category = 'platform';
        settings = this.platformSettings;
        break;
      case 'pricing':
        category = 'pricing';
        settings = this.pricingSettings;
        break;
      case 'notification':
        category = 'notification';
        settings = this.notificationSettings;
        break;
      case 'operational':
        category = 'operational';
        settings = this.operationalSettings;
        break;
      case 'payment':
        category = 'payment';
        settings = this.paymentSettings;
        break;
      default:
        console.error('Unknown section:', section);
        this.isSaving = false;
        return;
    }

    // Convert settings object to string map
    const settingsMap = this.objectToSettingsMap(settings);

    this.settingservice.updateCategorySettings(category, settingsMap).subscribe({
      next: () => {
        this.isSaving = false;
        alert(`${section} settings saved successfully!`);
      },
      error: (error) => {
        console.error(`Error saving ${section} settings:`, error);
        this.isSaving = false;
        alert(`Failed to save ${section} settings. Please try again.\n${error.message}`);
      }
    });
  }
}
