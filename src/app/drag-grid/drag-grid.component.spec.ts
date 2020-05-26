import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragGridComponent } from './drag-grid.component';

describe('DragGridComponent', () => {
  let component: DragGridComponent;
  let fixture: ComponentFixture<DragGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
