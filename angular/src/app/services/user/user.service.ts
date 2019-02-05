import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { User } from '../../../../../firebase/functions/src/models/user'
import { filter, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RxEffectiveStateStore<State> {
  
  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false
      }
    )
  }

  public loadUser(userId: string, refresh?: boolean) {
    if (userId === this.state.lastUserId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          user: document.data() as User,
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

interface State extends RxEffectiveState {
  user?: User
  lastUserId?: string
}
