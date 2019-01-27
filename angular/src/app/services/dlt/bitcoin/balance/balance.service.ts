import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
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
        amount: 0,
        custodialLightningAmount: 0
      }
    )
  }

  public loadBalance(address: string, userId: string, refresh?: boolean) {
    if(this.state.lastAddress === address && this.state.lastUserId === userId && !refresh) {
      return
    }
    this.streamLoadingState()

    forkJoin(
      this.http.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`),
      this.firestore.collection("users").doc(userId).collection("custodies").doc("lightning").collection("transactions").get()
    ).subscribe(
      ([data, transactions]) => {
        const state: State = {
          amount: Number((data as any).balance),
          custodialLightningAmount: transactions.docs.map(doc => doc.data() as CustodialTransaction).map(t => t.amount).reduce((a, b) => a+ b),
          lastAddress: address,
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
  custodialLightningAmount: number
  lastAddress?: string
  lastUserId?: string
}