import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMaterials } from './manage-materials';

describe('ManageMaterials', () => {
  let component: ManageMaterials;
  let fixture: ComponentFixture<ManageMaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
