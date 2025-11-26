import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequests } from './user-requests';

describe('UserRequests', () => {
  let component: UserRequests;
  let fixture: ComponentFixture<UserRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
