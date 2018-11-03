import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NemAddressInputComponent } from './nem-address-input.component';

describe('NemAddressInputComponent', () => {
  let component: NemAddressInputComponent;
  let fixture: ComponentFixture<NemAddressInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NemAddressInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NemAddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
