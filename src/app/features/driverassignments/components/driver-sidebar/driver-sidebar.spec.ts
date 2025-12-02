import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSidebar } from './driver-sidebar';

describe('DriverSidebar', () => {
  let component: DriverSidebar;
  let fixture: ComponentFixture<DriverSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
