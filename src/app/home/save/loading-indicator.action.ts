import { Action } from '@ngrx/store';

export const TOGGLE_LOADING_INDICATOR = 'TOGGLE_LOADING_INDICATOR';

export class ToggleLoadingIndicator implements Action {
  readonly type = TOGGLE_LOADING_INDICATOR;
  constructor(public payload: boolean) {}
}

export type LoadingIndicatorActions = ToggleLoadingIndicator;
