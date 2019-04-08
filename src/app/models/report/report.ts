export interface Report {
  init: string;
  reportName: string;
  pathReportOnClearServer?: string;
  server?: string;
  classNameForReplaceSQL?: string;
  parameters: { [key: string]: any };
}
