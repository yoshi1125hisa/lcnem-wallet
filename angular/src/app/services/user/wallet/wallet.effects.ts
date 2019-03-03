import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { WalletActionTypes, WalletActions, LoadWalletsSuccess, LoadWalletsError, AddWalletSuccess, AddWalletError, UpdateWalletSuccess, UpdateWalletError, DeleteWalletSuccess, DeleteWalletError, LoadWallets } from './wallet.actions';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError, filter, first, concatMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { AuthService } from '../../auth/auth.service';
import { LoadUser } from '../user.actions';
import { SimpleWallet, Password } from 'nem-library';
import { State } from '../../reducer';
import { Tuple } from '../../../classes/tuple';

@Injectable()
export class WalletEffects {


  @Effect()
  loadWallets$ = this.actions$.pipe(
    ofType(WalletActionTypes.LoadWallets),
    map(action => action.payload),
    concatMap(payload => this.wallet$.pipe(
      first(),
      map(state => Tuple(payload, state))
    )),
    filter(([payload, state]) => (!state.lastUserId || state.lastUserId !== payload.userId) || payload.refresh!),
    concatMap(([payload, state]) => this.firestore.collection('users').doc(payload.userId).collection('wallets').get().pipe(
      map(
        (collection) => {
          const localWallets = this.getLocalWallets();
          const ids = collection.docs.map(doc => doc.id);
          const entities: { [id: string]: Wallet } = {};
          for (const doc of collection.docs) {
            entities[doc.id] = doc.data() as Wallet;
            if (localWallets[doc.id]) {
              state.entities[doc.id].wallet = localWallets[doc.id];
            }
          }
          const currentWalletId = localStorage.getItem('currentWallet') || undefined;

          return { ids: ids, entities: entities, currentWalletId: currentWalletId };
        }
      ),
      map(({ ids, entities, currentWalletId }) => new LoadWalletsSuccess({ userId: payload.userId, ids: ids, entities: entities, currentWalletId: currentWalletId }))
    )),
    catchError(error => of(new LoadWalletsError({ error: error })))
  );

  @Effect()
  addWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.AddWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        const _wallet = { ...payload.wallet };
        if (_wallet.local) {
          delete _wallet.wallet;
        }

        return from(this.firestore.collection('users').doc(payload.userId).collection('wallets').add(_wallet)).pipe(
          map(
            (doc) => {
              if (payload.wallet.local) {
                this.addLocalWallet(doc.id, payload.wallet.wallet || '');
              }
              return { id: doc.id, wallet: payload.wallet };
            }
          )
        );
      }
    ),
    map(({ id, wallet }) => new AddWalletSuccess({ walletId: id, wallet: wallet })),
    catchError(error => of(new AddWalletError({ error: error })))
  );

  @Effect()
  updateWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.UpdateWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        const _wallet = { ...payload.wallet };
        if (_wallet.local && _wallet.wallet) {
          this.addLocalWallet(payload.walletId, _wallet.wallet);
          delete payload.wallet.wallet;
        }

        return from(this.firestore.collection('users').doc(payload.userId).collection('wallets').doc(payload.walletId).set(_wallet)).pipe(
          map(_ => payload)
        );
      }
    ),
    map(payload => new UpdateWalletSuccess({ walletId: payload.walletId, wallet: payload.wallet })),
    catchError(error => of(new UpdateWalletError({ error: error })))
  );

  @Effect()
  deleteWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.DeleteWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection('users').doc(payload.userId).collection('wallets').doc(payload.walletId).delete()).pipe(
          map(_ => payload)
        );
      }
    ),
    map(payload => new DeleteWalletSuccess({ walletId: payload.walletId })),
    catchError(error => of(new DeleteWalletError({ error: error })))
  );

  @Effect({ dispatch: false })
  setCurrentWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.SetCurrentWallet),
    map(action => action.payload),
    map(
      (payload) => {
        if (!payload.walletId) {
          localStorage.removeItem('currentWallet');
        } else {
          localStorage.setItem('currentWallet', payload.walletId);
        }
      }
    )
  );

  @Effect()
  addLocalWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.AddLocalWallet),
    map(action => action.payload),
    map(
      (payload) => {
        this.addLocalWallet(payload.walletId, payload.wallet.writeWLTFile());
      }
    )
  );

  public wallet$ = this.store.select(state => state.wallet);
  public user$ = this.store.select(state => state.user);

  constructor(
    private actions$: Actions<WalletActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {
    this.auth.user$.pipe(
      filter(user => user !== null)
    ).subscribe(
      async (user) => {
        // レガシー
        this.store.dispatch(new LoadUser({ userId: user!.uid }));

        const state = await this.user$.pipe(
          filter(state => !state.loading),
          first()
        ).toPromise();

        if (state.user && (state.user as any).wallet) {
          const account = SimpleWallet.readFromWLT((state.user as any).wallet).open(new Password(user!.uid));

          await this.firestore.collection('users').doc(user!.uid).collection('wallets').add(
            {
              name: '1',
              local: false,
              nem: account.address.plain(),
              wallet: (state.user as any).wallet
            } as Wallet
          );
          delete (state.user as any).wallet;

          await this.firestore.collection('users').doc(user!.uid).set(state.user!);
        }
        // レガシー
        this.store.dispatch(new LoadWallets({ userId: user!.uid }));
      }
    );
  }


  private addLocalWallet(id: string, wallet: string) {
    const localWallets = this.getLocalWallets();
    localWallets[id] = wallet;
    this.setLocalWallet(localWallets);
  }

  private setLocalWallet(localWallets: { [id: string]: string }) {
    localStorage.setItem('wallets', JSON.stringify(localWallets));
  }

  private getLocalWallets(): { [id: string]: string } {
    const json = localStorage.getItem('wallets') || '';
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

}
