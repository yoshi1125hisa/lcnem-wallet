import { Injectable } from '@angular/core';
import { RxEntityStateStore, RxEntityState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { Application } from '../../../../../../firebase/functions/src/models/application'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends RxEntityStateStore<State, Application> {
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

  public loadApplications(userId: string, refresh?: boolean) {
    if(userId === this.state.lastUserId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("applications").get().subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {},
          lastUserId: userId
        }
        for(const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Application
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public addApplication(userId: string, application: Application) {
    if(userId !== this.state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("applications").add(application)).subscribe(
      (document) => {
        const state: State = {
          ...this.getEntityAddedState(document.id, application),
          loading: false
        }
        
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public updateApplication(userId: string, applicationId: string, application: Application) {
    if(userId !== this.state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("applications").doc(applicationId).set(application)).subscribe(
      () => {
        const state: State = {
          ...this.getEntityUpdatedState(applicationId, application),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public deleteApplication(userId: string, contactId: string) {
    if(userId !== this.state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("applications").doc(contactId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.getEntityDeletedState(contactId),
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

interface State extends RxEntityState<Application> {
  lastUserId?: string
}
