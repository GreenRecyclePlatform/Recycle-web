import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllDrivers } from './all-drivers';

describe('AllDrivers', () => {
  let component: AllDrivers;
  let fixture: ComponentFixture<AllDrivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDrivers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDrivers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
