import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTopComponent } from './category-top.component';

describe('CategoryTopComponent', () => {
  let component: CategoryTopComponent;
  let fixture: ComponentFixture<CategoryTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
