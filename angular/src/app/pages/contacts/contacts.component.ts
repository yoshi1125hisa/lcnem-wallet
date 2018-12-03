import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Contact } from '../../store/contact/contact.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactEditDialogComponent } from './contact-edit-dialog/contact-edit-dialog.component';
import { Observable, of, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { DeleteContacts, AddContact, LoadContacts } from 'src/app/store/contact/contact.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { LanguageService } from '../../services/language/language.service';
import { Dictionary } from '@ngrx/entity';
import { Back } from 'src/app/store/router/router.actions';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  public contacts$: Observable<Dictionary<Contact>>;
  public contactIds$: Observable<(string | number)[]>;
  public loading$: Observable<boolean>;
  get lang() { return this.language.twoLetter }

  public dataSource = new MatTableDataSource<{
    id: string,
    contact: Contact
  }>();
  public displayedColumns = ["select", "name", "tags", "action"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public selection = new SelectionModel<{
    id: string,
    contact: Contact
  }>(true, []);

  constructor(
    private store: Store<State>,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private language: LanguageService
  ) {
    this.contacts$ = store.select(state => state.contact.entities)
    this.loading$ = store.select(state => state.contact.loading)
    this.contactIds$ = store.select(state => state.contact.ids)
  }

  ngOnInit() {
    this.load()
  }

  public load() {
    const uid = this.auth.auth.currentUser!.uid;
    this.store.dispatch(new LoadContacts({ userId: uid }));

    this.dataSource.data = [];


    this.contactIds$.pipe(
      mergeMap(
        ids => from(ids)
      ),
      map((id, index) =>
        this.contacts$.subscribe(
          contacts => {
            this.dataSource.data.push(
              {
                id: String(index),
                contact: contacts[id]
              }
            )
          }
        )
      )
    );
    this.dataSource.data = this.dataSource.data;

    this.dataSource.paginator = this.paginator;
    this.paginator.length = this.dataSource!.data.length;
    this.paginator.pageSize = 10;

    this.onPageChanged({
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    });

  }

  public back() {
    this.store.dispatch(new Back({ commands: [""] }));
  }

  public async onPageChanged(pageEvent: PageEvent) {
    this.loading$ = this.store.select(state => state.contact.loading)
  }

  public async showContact(id: string) {
    await this.dialog.open(ContactDialogComponent, {
      data: {
        id: id
      }
    }).afterClosed().toPromise();
  }

  public createContact() {
    const uid = this.auth.auth.currentUser!.uid;
    this.dialog.open(ContactEditDialogComponent,
      {
        data: {
          contact: {}
        }
      })
      .afterClosed().subscribe(
        (result: Contact) => {
          if (!result) {
            return;
          }
          this.store.dispatch(new AddContact({
            userId: uid, contact: result
          }
          )
          )
        }
      )
  }

  public deleteContact() {
    const uid = this.auth.auth.currentUser!.uid;
    const ids = this.selection.selected.map(obj => obj.id)
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.confirm[this.lang]
      }
    }).afterClosed().subscribe(
      result => {
        if (!result) {
          return;
        }
        this.store.dispatch(new DeleteContacts({ userId: uid, ids: ids }));
      }
    );
  }
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public translation = {
    contacts: {
      en: "Contact list",
      ja: "コンタクトリスト"
    } as any,
    empty: {
      en: "There is no contacts.",
      ja: "コンタクトはありません。"
    } as any,
    confirm: {
      en: "Are you sure?",
      ja: "削除しますか？"
    } as any,
    createContact: {
      en: "Create new contact",
      ja: "新しいコンタクトを作成"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any
  };

}
