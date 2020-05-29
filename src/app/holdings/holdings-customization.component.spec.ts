import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingsCustomizationComponent } from './holdings-customization.component';

describe('HoldingsCustomizationComponent', () => {
  let component: HoldingsCustomizationComponent;
  let fixture: ComponentFixture<HoldingsCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldingsCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingsCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
