import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugstoreComponent } from './drugstore.component';

describe('DrugstoreComponent', () => {
  let component: DrugstoreComponent;
  let fixture: ComponentFixture<DrugstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
