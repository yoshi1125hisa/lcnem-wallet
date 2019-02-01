import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChequeComponent } from './order-cheque.component';

describe('OrderChequeComponent', () => {
  let component: OrderChequeComponent;
  let fixture: ComponentFixture<OrderChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
