import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends RxEffectiveStateStore<State> {

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        amount: 0
      }
    )
  }

}

interface State extends RxEffectiveState {
  amount: number
  lastUserId?: string
}