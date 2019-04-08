import { Paginator } from '@libs/models/paginator/paginator';
import { FwMessage } from '@libs/models/message';

export interface CommonResponse<T> {
  results?: T[];
  result?: T;
  paginator?: Paginator;
  messages?: FwMessage[];
}
