import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ApplicationActionTypes, ApplicationActions, LoadApplicationsSuccess, LoadApplicationsError, AddApplicationSuccess, UpdateApplicationSuccess, AddApplicationError, UpdateApplicationError, DeleteApplicationSuccess, DeleteApplicationError } from './application.actions';
import * as fromApplication from './application.reducer';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Application } from '../../../../../../firebase/functions/src/models/application';

@Injectable()
export class ApplicationEffects {


  @Effect()
  loadApplications$ = this.actions$.pipe(
    ofType(ApplicationActionTypes.LoadApplications),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.store.pipe(
          mergeMap(
            (state) => {
              if (state.lastUserId && state.lastUserId === payload.userId && !payload.refresh) {
                return of({ ids: state.ids, entities: state.entities })
              }

              return this.firestore.collection("users").doc(payload.userId).collection("applications").get().pipe(
                map(
                  (collection) => {
                    const ids = collection.docs.map(doc => doc.id)
                    const entities: { [id: string]: Application } = {}
                    for (const doc of collection.docs) {
                      entities[doc.id] = doc.data() as Application
                    }

                    return { ids: ids, entities: entities }
                  }
                )
              )
            }
          )
        )
      }
    ),
    map(({ ids, entities }) => new LoadApplicationsSuccess({ ids: ids, entities: entities })),
    catchError(error => of(new LoadApplicationsError({ error: error })))
  );

  @Effect()
  addApplication$ = this.actions$.pipe(
    ofType(ApplicationActionTypes.AddApplication),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("applications").add(payload.application)).pipe(
          map(
            (doc) => {
              return { id: doc.id, application: payload.application }
            }
          )
        )
      }
    ),
    map(({ id, application }) => new AddApplicationSuccess({ applicationId: id, application: application })),
    catchError(error => of(new AddApplicationError({ error: error })))
  )

  @Effect()
  updateApplication$ = this.actions$.pipe(
    ofType(ApplicationActionTypes.UpdateApplication),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("applications").doc(payload.applicationId).set(payload.application)).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new UpdateApplicationSuccess({ applicationId: payload.applicationId, application: payload.application })),
    catchError(error => of(new UpdateApplicationError({ error: error })))
  )

  @Effect()
  deleteApplication$ = this.actions$.pipe(
    ofType(ApplicationActionTypes.DeleteApplication),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("applications").doc(payload.applicationId).delete()).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new DeleteApplicationSuccess({ applicationId: payload.applicationId })),
    catchError(error => of(new DeleteApplicationError({ error: error })))
  )

  constructor(
    private actions$: Actions<ApplicationActions>,
    private store: Store<fromApplication.State>,
    private firestore: AngularFirestore
  ) { }

}
