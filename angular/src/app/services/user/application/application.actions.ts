import { Action } from '@ngrx/store';

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
}

export class LoadApplicationsSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadApplicationsSuccess;
}

export class LoadApplicationsError implements Action {
  readonly type = ApplicationActionTypes.LoadApplicationsError;
}

export class AddApplication implements Action {
  readonly type = ApplicationActionTypes.AddApplication;
}

export class AddApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.AddApplicationSuccess;
}

export class AddApplicationError implements Action {
  readonly type = ApplicationActionTypes.AddApplicationError;
}

export class UpdateApplication implements Action {
  readonly type = ApplicationActionTypes.UpdateApplication;
}

export class UpdateApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.UpdateApplicationSuccess;
}

export class UpdateApplicationError implements Action {
  readonly type = ApplicationActionTypes.UpdateApplicationError;
}

export class DeleteApplication implements Action {
  readonly type = ApplicationActionTypes.DeleteApplication;
}

export class DeleteApplicationSuccess implements Action {
  readonly type = ApplicationActionTypes.DeleteApplicationSuccess;
}

export class DeleteApplicationError implements Action {
  readonly type = ApplicationActionTypes.DeleteApplicationError;
}


export type ApplicationActions = LoadApplications | LoadApplicationsSuccess | LoadApplicationsError | AddApplication | AddApplicationSuccess | AddApplicationError | UpdateApplication | UpdateApplicationSuccess | UpdateApplicationError | DeleteApplication | DeleteApplicationSuccess | DeleteApplicationError;
