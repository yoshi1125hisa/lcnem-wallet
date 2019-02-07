import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false
      }
    )
  }

}

interface State extends RxEffectiveState {
}
