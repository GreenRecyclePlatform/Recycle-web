import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPayments } from './admin-payments';

describe('AdminPayments', () => {
  let component: AdminPayments;
  let fixture: ComponentFixture<AdminPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
