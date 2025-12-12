import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWithdrawals } from './manage-withdrawals';

describe('ManageWithdrawals', () => {
  let component: ManageWithdrawals;
  let fixture: ComponentFixture<ManageWithdrawals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWithdrawals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWithdrawals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
