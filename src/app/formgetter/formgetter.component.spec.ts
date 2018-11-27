import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormgetterComponent } from './formgetter.component';

describe('FormgetterComponent', () => {
  let component: FormgetterComponent;
  let fixture: ComponentFixture<FormgetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormgetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormgetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
