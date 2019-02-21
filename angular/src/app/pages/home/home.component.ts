import { Component, OnInit } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { Asset, NEMLibrary, NetworkTypes } from 'nem-library';
import { LanguageService } from '../../services/language/language.service';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { State } from '../../services/reducer';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private store: Store<State>
  ) {

  }

  private wallet$ = this.store.select(state => state.wallet);

  public photoUrl$ = this.auth.user$.pipe(
    map(user => user && user.photoURL ? user.photoURL : '')
  );

  public currentWalletName$ = this.wallet$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!].name)
  );

  public translation = {
    language: {
      en: 'Language',
      ja: '言語'
    } as any,
    wallets: {
      en: 'Change the wallet',
      ja: 'ウォレットの切り替え'
    } as any,
    deposit: {
      en: 'Deposit',
      ja: '入金'
    } as any,
    withdraw: {
      en: 'Withdraw',
      ja: '出金'
    } as any,
    contacts: {
      en: 'Contact list',
      ja: 'コンタクトリスト'
    } as any,
    setting: {
      en: 'Setting',
      ja: '設定'
    } as any
  };

  ngOnInit() {
  }
}
