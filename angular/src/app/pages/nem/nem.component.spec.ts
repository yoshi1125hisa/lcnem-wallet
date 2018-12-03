import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NemComponent } from './nem.component';

describe('NemComponent', () => {
  let component: NemComponent;
  let fixture: ComponentFixture<NemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
