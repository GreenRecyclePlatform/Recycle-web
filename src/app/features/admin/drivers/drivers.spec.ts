import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drivers } from './drivers';

describe('Drivers', () => {
  let component: Drivers;
  let fixture: ComponentFixture<Drivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drivers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Drivers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
