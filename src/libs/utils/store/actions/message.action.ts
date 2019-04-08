import { Message } from 'primeng/primeng';
import { Action } from '@ngrx/store';

export const FETCH_SUCCESS_MESSAGE = 'FETCH_SUCCESS_MESSAGE';
export const CREATE_SUCCESS_MESSAGE = 'CREATE_SUCCESS_MESSAGE';
export const EDIT_SUCCESS_MESSAGE = 'EDIT_SUCCESS_MESSAGE';
export const REMOVE_SUCCESS_MESSAGE = 'REMOVE_SUCCESS_MESSAGE';
export const SUCCESS_MESSAGE = 'SUCCESS_MESSAGE';
export const INFO_MESSAGE = 'INFO_MESSAGE';
export const WARNING_MESSAGE = 'WARNING_MESSAGE';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const SET_VALIDATION_MESSAGE = 'SET_VALIDATION_MESSAGE';

export class FetchSuccessMessage implements Action {
  readonly type = FETCH_SUCCESS_MESSAGE;
  constructor(public payload: Message) {}
}

export class CreateSuccessMessage implements Action {
  readonly type = CREATE_SUCCESS_MESSAGE;
}

export class EditSuccessMessage implements Action {
  readonly type = EDIT_SUCCESS_MESSAGE;
}

export class RemoveSuccessMessage implements Action {
  readonly type = REMOVE_SUCCESS_MESSAGE;
}

export class SuccessMessage implements Action {
  readonly type = SUCCESS_MESSAGE;
  constructor(public payload: string[]) {}
}

export class InfoMessage implements Action {
  readonly type = INFO_MESSAGE;
  constructor(public payload: string[]) {}
}
export class WarningMessage implements Action {
  readonly type = WARNING_MESSAGE;
  constructor(public payload: string[]) {}
}

export class ErrorMessage implements Action {
  readonly type = ERROR_MESSAGE;
  constructor(public payload: string[]) {}
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export class SetValidationMessage implements Action {
  readonly type = SET_VALIDATION_MESSAGE;
  constructor(public payload: string[]) {}
}

export type ALL =
  | FetchSuccessMessage
  | CreateSuccessMessage
  | EditSuccessMessage
  | RemoveSuccessMessage
  | SuccessMessage
  | InfoMessage
  | WarningMessage
  | ErrorMessage
  | ClearMessage
  | SetValidationMessage;
