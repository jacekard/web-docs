import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDocComponent } from './single-doc.component';

describe('SingleDocComponent', () => {
  let component: SingleDocComponent;
  let fixture: ComponentFixture<SingleDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
