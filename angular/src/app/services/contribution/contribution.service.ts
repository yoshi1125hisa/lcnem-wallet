import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contribution } from '../../../../../firebase/functions/src/models/contribution'
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributionService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        contributions: []
      }
    )
  }

  public loadContributions(refresh?: boolean) {
    this.streamLoadingState()

    from(this.firestore.collection("contributions").ref.limit(100).get()).subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          contributions: collection.docs.map(doc => doc.data() as Contribution)
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
  contributions: Contribution[]
}
