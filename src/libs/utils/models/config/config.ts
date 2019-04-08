export interface Config {
  header?: {
    userImg?: boolean;
    locale?: boolean;
    brandLogo?: {
      imgUrl?: string;
      text?: string;
    };
  };
  footer?: {};
  panel?: {
    schedule?: boolean;
    todo?: boolean;
    news?: boolean;
    manual?: boolean;
  };
  selectRole?: boolean;
  enterSearch?: boolean;
}
