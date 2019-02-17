import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Address, Wallet } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { State as MultisigState } from '../../../../services/dlt/nem/multisig/multisig.reducer';
import { State as WalletState } from '../../../../services/user/wallet/wallet.reducer';
import { Store } from '@ngrx/store';
import { LoadMultisigs } from '../../../../services/dlt/nem/multisig/multisig.actions';
import { State } from '../../../../services/reducer';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public get lang() { return this.language.code }

  public wallet$ = this.store.select(state => state.wallet)
  public multisig$ = this.store.select(state => state.multisig)

  public loading$ = combineLatest(
    this.wallet$,
    this.multisig$
  ).pipe(
    map(fork => fork[0].loading || fork[1].loading)
  )

  constructor(
    private language: LanguageService,
    private store: Store<State>
  ) {
  }

  ngOnInit() {
    this.load();
  }

  public async load(refresh?: boolean) {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const address = new Address(state.entities[state.currentWalletId!].nem)
    this.store.dispatch(new LoadMultisigs({ address, refresh }))
  }

  public onClick(address: string) {
  }

  public translation = {
    cosignatoryOf: {
      en: "Multisig addresses you can cosign",
      ja: "連署名できるマルチシグアドレス"
    } as any,
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    } as any
  }
}
