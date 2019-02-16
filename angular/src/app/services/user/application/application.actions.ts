import { Action } from '@ngrx/store';
import { Application } from '../../../../../../firebase/functions/src/models/application';

export enum ApplicationActionTypes {
  LoadApplications = 'LoadApplications',
  LoadApplicationsSuccess = 'LoadApplicationsSuccess',
  LoadApplicationsError = 'LoadApplicationsError',
  AddApplication = 'AddApplication',
  AddApplicationSuccess = 'AddApplicationSuccess',
  AddApplicationError = 'AddApplicationError',
  UpdateApplication = 'UpdateApplication',
  UpdateApplicationSuccess = 'UpdateApplicationSuccess',
  UpdateApplicationError = 'UpdateApplicationError',
  DeleteApplication = 'DeleteApplication',
  DeleteApplicationSuccess = 'DeleteApplicationSuccess',
  DeleteApplicationError = 'DeleteApplicationError'
}


export class LoadApplications implements Action {
  readonly type = ApplicationActionTypes.LoadApplications;

  constructor(public payload: { userId: string, refresh?: boolean }) { }
}

export class LoadApplicationsSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadApplicationsSuccess;

  constructor(public payload: { ids: string[], entities: { [id: string]: Application } }) { }
}

export class LoadApplicationsError implements Action {
  readonly type = ApplicationActionTypes.LoadApplicationsError;

  constructor(public payload: { error: Error }) { }
}

export class AddApplication implements Action {
  readonly type = ApplicationActionTypes.AddApplication;

  constructor(public payload: { userId: string, application: Application }) { }
}

export class AddApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.AddApplicationSuccess;

  constructor(public payload: { applicationId: string, application: Application }) { }
}

export class AddApplicationError implements Action {
  readonly type = ApplicationActionTypes.AddApplicationError;

  constructor(public payload: { error: Error }) { }
}

export class UpdateApplication implements Action {
  readonly type = ApplicationActionTypes.UpdateApplication;

  constructor(public payload: { userId: string, applicationId: string, application: Application }) { }
}

export class UpdateApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.UpdateApplicationSuccess;

  constructor(public payload: { applicationId: string, application: Application }) { }
}

export class UpdateApplicationError implements Action {
  readonly type = ApplicationActionTypes.UpdateApplicationError;

  constructor(public payload: { error: Error }) { }
}

export class DeleteApplication implements Action {
  readonly type = ApplicationActionTypes.DeleteApplication;

  constructor(public payload: { userId: string, applicationId: string }) { }
}

export class DeleteApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.DeleteApplicationSuccess;

  constructor(public payload: { applicationId: string }) { }
}

export class DeleteApplicationError implements Action {
  readonly type = ApplicationActionTypes.DeleteApplicationError;

  constructor(public payload: { error: Error }) { }
}



export type ApplicationActions = LoadApplications | LoadApplicationsSuccess | LoadApplicationsError | AddApplication | AddApplicationSuccess | AddApplicationError | UpdateApplication | UpdateApplicationSuccess | UpdateApplicationError | DeleteApplication | DeleteApplicationSuccess | DeleteApplicationError;
