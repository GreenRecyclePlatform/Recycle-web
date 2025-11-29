import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestsDashboard } from './admin-requests-dashboard';

describe('AdminRequestsDashboard', () => {
  let component: AdminRequestsDashboard;
  let fixture: ComponentFixture<AdminRequestsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRequestsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
