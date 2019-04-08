import { Uid } from '@libs/models/uid/uid';

export interface Paginator extends Uid {

    limit?: number;
    offset?: number;
    count?: number;
    sorts?: string;
}
