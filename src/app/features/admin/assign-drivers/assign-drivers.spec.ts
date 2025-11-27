import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDrivers } from './assign-drivers';

describe('AssignDrivers', () => {
  let component: AssignDrivers;
  let fixture: ComponentFixture<AssignDrivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDrivers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDrivers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
