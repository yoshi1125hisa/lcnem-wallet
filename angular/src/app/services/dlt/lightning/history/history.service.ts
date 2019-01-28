import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { CustodialTransaction } from '../../../../../../../firebase/functions/src/models/custodial-transaction';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        transactions: []
      }
    )
  }

  public loadHistories(userId: string, refresh?: boolean) {
    if (this.state.lastUserId === userId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("custodies").doc("lightning").collection("transactions").get().subscribe(
      (transactions) => {
        const state: State = {
          ...this.state,
          loading: false,
          transactions: transactions.docs.map(doc => doc.data() as CustodialTransaction),
          lastUserId: userId
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  transactions: CustodialTransaction[]
  lastUserId?: string
}
