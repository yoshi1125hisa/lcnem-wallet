import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import { RouterService } from '../../../services/router/router.service';
import { LanguageService } from '../../../services/language/language.service';
import { AuthService } from '../../../services/auth/auth.service';
import { map, filter, first } from 'rxjs/operators';
import { ApplicationDialogComponent } from './application-dialog/application-dialog.component';
import * as fromApplication from '../../../services/user/application/application.reducer'
import { Store } from '@ngrx/store';
import { LoadApplications, AddApplication, UpdateApplication, DeleteApplication } from 'src/app/services/user/application/application.actions';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  get lang() { return this.language.code }

  public loading$ = combineLatest(
    this.auth.user$,
    this.application$
  ).pipe(
    map(([auth, application]) => auth === null || application.loading)
  )

  public state$ = this.application$

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private application$: Store<fromApplication.State>
  ) {
  }

  ngOnInit() {
    this.load()
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    this.application$.dispatch(new LoadApplications({ userId: user!.uid, refresh: refresh }))
  }

  public back() {
    this._router.back([""])
  }

  public async createApplication() {
    const result = await this.dialog.open(
      ApplicationDialogComponent,
      {
        data: {
          application: {}
        }
      }
    ).afterClosed().toPromise()

    if (!result) {
      return
    }

    this.application$.dispatch(new AddApplication({userId: this.auth.user!.uid, application: result}))
  }

  public async editApplication(id: string) {
    const name = await this.dialog.open(
      ApplicationDialogComponent,
      {
        data: {
          application: (await this.application$.pipe(first()).toPromise()).entities[id]
        }
      }
    ).afterClosed().toPromise()

    if (!name) {
      return
    }

    this.application$.dispatch(new UpdateApplication({userId: this.auth.user!.uid, applicationId: id, application: name}))
  }

  public deleteApplication(id: string) {
    const result = window.confirm(this.translation.confirm[this.lang])

    if (!result) {
      return
    }

    this.application$.dispatch(new DeleteApplication({userId: this.auth.user!.uid, applicationId: id}))
  }

  public translation = {
    applications: {
      en: "Third party applications",
      ja: "サードパーティアプリ"
    } as any,
    empty: {
      en: "There is no applications you created.",
      ja: "作成したサードパーティアプリはありません。"
    } as any,
    confirm: {
      en: "Are you sure?",
      ja: "削除しますか？"
    } as any,
    createContact: {
      en: "Create new application",
      ja: "新しいアプリを作成"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any
  }
}
