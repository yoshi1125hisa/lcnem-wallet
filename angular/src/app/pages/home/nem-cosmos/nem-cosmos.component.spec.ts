import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NemCosmosComponent } from './nem-cosmos.component';

describe('NemCosmosComponent', () => {
  let component: NemCosmosComponent;
  let fixture: ComponentFixture<NemCosmosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NemCosmosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NemCosmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
