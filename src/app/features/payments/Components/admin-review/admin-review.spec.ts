import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReview } from './admin-review';

describe('AdminReview', () => {
  let component: AdminReview;
  let fixture: ComponentFixture<AdminReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
