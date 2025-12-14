import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentDashboard } from './admin-payment-dashboard';

describe('AdminPaymentDashboard', () => {
  let component: AdminPaymentDashboard;
  let fixture: ComponentFixture<AdminPaymentDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPaymentDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPaymentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
