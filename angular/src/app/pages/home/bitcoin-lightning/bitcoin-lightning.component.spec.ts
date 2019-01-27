import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinLightningComponent } from './bitcoin-lightning.component';

describe('BitcoinLightningComponent', () => {
  let component: BitcoinLightningComponent;
  let fixture: ComponentFixture<BitcoinLightningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitcoinLightningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitcoinLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
