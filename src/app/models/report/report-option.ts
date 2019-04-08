//import { ReportType } from '@libs/utils/enum/report-type.enum';
import { ReportType } from '@enum/report-type.enum';

export interface ReportOption {
  label: string;
  value: ReportType;
  default?: boolean;
  isPreviewable?: boolean;
}
