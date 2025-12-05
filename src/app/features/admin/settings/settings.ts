import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar,AdminSidebarComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  activeTab: string = 'platform';

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

  ngOnInit(): void {
    // Load settings from API if needed
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleSaveSettings(section: string): void {
    // Call API to save settings
    alert(`${section} settings saved successfully!`);
  }
}
/*[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetSettings()
    {
        var settings = new
        {
            platform = await _context.PlatformSettings.FirstOrDefaultAsync(),
            pricing = await _context.PricingSettings.FirstOrDefaultAsync()
            // Add others...
        };
        return Ok(settings);
    }

    [HttpPut("platform")]
    public async Task<ActionResult> UpdatePlatformSettings([FromBody] PlatformSettings settings)
    {
        var existing = await _context.PlatformSettings.FirstOrDefaultAsync();
        if (existing != null)
        {
            existing.PlatformName = settings.PlatformName;
            existing.PlatformEmail = settings.PlatformEmail;
            existing.Timezone = settings.Timezone;
            existing.Currency = settings.Currency;
            existing.Language = settings.Language;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();
        return Ok();
    }
}*/
