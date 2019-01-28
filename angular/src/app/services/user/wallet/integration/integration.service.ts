import { Injectable } from '@angular/core';
import { RxEntityStateStore, RxEntityState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { Integration } from '../../../../../../../firebase/functions/src/models/integration'

@Injectable({
  providedIn: 'root'
})
export class IntegrationService extends RxEntityStateStore<State, Integration> {
  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        ids: [],
        entities: {}
      }
    )
  }

  public loadIntegrations(userId: string, walletId: string, refresh?: boolean) {
    if (walletId !== this.state.lastWalletId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).collection("integrations").get().subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {},
          lastWalletId: walletId
        }
        for (const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Integration
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public deleteIntegration(userId: string, walletId: string, integrationId: string) {
    if (walletId !== this.state.lastWalletId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).collection("integrations").doc(integrationId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.getEntityDeletedState(integrationId),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public translation = {
    
  }
}

interface State extends RxEntityState<Integration> {
  lastWalletId?: string
}
