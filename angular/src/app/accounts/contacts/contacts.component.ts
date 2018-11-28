import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ContactsService } from '../../services/contacts.service';
import { back } from '../../models/back';
import { lang } from '../../models/lang';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactEditDialogComponent } from './contact-edit-dialog/contact-edit-dialog.component';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { DeleteContacts, AddContact } from 'src/app/store/contact/contact.actions';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading$: Observable<boolean>;
  public loading = true;
  get lang() { return lang; }

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
    private router: Router,
    private auth: AngularFireAuth,
    private user: UserService,
    private contact: ContactsService,
    private dialog: MatDialog
  ) {
    this.loading$ = store.select(state => state.contact.loading)
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.refresh();
    });
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    await this.contact.readContacts(force);

    this.dataSource.data = [];
    for (let id in this.contact.contacts!) {
      this.dataSource.data.push({
        id: id,
        contact: this.contact.contacts![id]
      })
    }
    this.dataSource.data = this.dataSource.data;

    this.dataSource.paginator = this.paginator;
    this.paginator.length = this.dataSource!.data.length;
    this.paginator.pageSize = 10;

    this.onPageChanged({
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    });

    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async onPageChanged(pageEvent: PageEvent) {
    this.loading = true;
    this.loading = false;
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
    this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact: {}
      }
    }).afterClosed().subscribe((x: Contact) =>
      of(this.store.dispatch(new AddContact({ userId: uid, contact: x })))
        .subscribe(x =>
          this.refresh()
        ))
  }

  public deleteContact() {
    const uid = this.auth.auth.currentUser!.uid;
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.confirm[this.lang]
      }
    }).afterClosed().subscribe(x =>
      this.store.dispatch(new DeleteContacts({ userId: uid, ids: this.selection }))
    )
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
