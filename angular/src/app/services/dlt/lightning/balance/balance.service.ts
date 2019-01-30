import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { CustodialTransaction } from '../../../../../../../firebase/functions/src/models/custodial-transaction';

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

  public loadBalance(userId: string, refresh?: boolean) {
    if(this.state.lastUserId === userId && !refresh) {
      return
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("custodies").doc("lightning").collection("transactions").get().subscribe(
      (transactions) => {
        const state: State = {
          amount: transactions.docs.map(doc => doc.data() as CustodialTransaction).map(t => t.amount).reduce((a, b) => a+ b),
          lastUserId: userId,
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State extends RxEffectiveState {
  amount: number
  lastUserId?: string
}