import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsetterComponent } from './formsetter.component';

describe('FormsetterComponent', () => {
  let component: FormsetterComponent;
  let fixture: ComponentFixture<FormsetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
