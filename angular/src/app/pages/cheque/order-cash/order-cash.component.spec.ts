import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCashComponent } from './order-cash.component';

describe('OrderCashComponent', () => {
  let component: OrderCashComponent;
  let fixture: ComponentFixture<OrderCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});