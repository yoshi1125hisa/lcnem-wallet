import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreateDialogComponent } from './wallet-create-dialog.component';

describe('WalletCreateDialogComponent', () => {
  let component: WalletCreateDialogComponent;
  let fixture: ComponentFixture<WalletCreateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCreateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
