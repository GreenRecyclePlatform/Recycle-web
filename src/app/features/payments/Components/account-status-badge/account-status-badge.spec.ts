import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatusBadge } from './account-status-badge';

describe('AccountStatusBadge', () => {
  let component: AccountStatusBadge;
  let fixture: ComponentFixture<AccountStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountStatusBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountStatusBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
