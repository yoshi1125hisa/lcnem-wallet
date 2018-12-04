import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../../../services/language/language.service';
import { Address, Wallet } from 'nem-library';
import { first, mergeMap, toArray, filter, map } from 'rxjs/operators';
import { MultisigService } from 'src/app/services/nem/multisig/multisig.service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public state$ = this.wallet.state$;
  public multisigs$: Observable<Address[]>;

  constructor(
    private multisig: MultisigService,
    private router: Router,
    private store: Store<State>,
    private language: LanguageService
  ) {
    this.multisigs$ = this.state$.pipe(
      mergeMap(
        (state) => {
          return from(state.ids).pipe(
            map(id => state.entities[id].multisig),
            toArray()
          )
        }
      )
    )

    this.state$.pipe(
      filter(state => this.state$.currentWalletId ? true : false),
      first()
    ).subscribe(
      () => {
        this.router.navigate([""])
      }
    )
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    this.multisigs$.pipe(
      map(
        (address) => {
          address.map(address => this.multisig.loadMultisig(address, true))
        }
      )
    )
  }

  public onClick(address: string) {
  }

  public translation = {
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    }
  }
}
