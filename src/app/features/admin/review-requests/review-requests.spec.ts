import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRequests } from './review-requests';

describe('ReviewRequests', () => {
  let component: ReviewRequests;
  let fixture: ComponentFixture<ReviewRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
