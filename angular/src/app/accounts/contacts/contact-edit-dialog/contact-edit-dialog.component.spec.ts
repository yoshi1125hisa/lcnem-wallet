import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEditDialogComponent } from './contact-edit-dialog.component';

describe('ContactEditDialogComponent', () => {
  let component: ContactEditDialogComponent;
  let fixture: ComponentFixture<ContactEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
