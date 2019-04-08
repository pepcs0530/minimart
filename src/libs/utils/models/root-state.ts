import { MessageState } from '@libs/models/message';


export interface RootState {
  app: { [appProps: string]: any };
  message: MessageState;
  
}
