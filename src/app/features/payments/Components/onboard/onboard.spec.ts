import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Onboard } from './onboard';

describe('Onboard', () => {
  let component: Onboard;
  let fixture: ComponentFixture<Onboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Onboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Onboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
