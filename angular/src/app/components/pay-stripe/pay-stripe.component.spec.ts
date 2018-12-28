import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStripeComponent } from './pay-stripe.component';

describe('PayStripeComponent', () => {
  let component: PayStripeComponent;
  let fixture: ComponentFixture<PayStripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayStripeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
