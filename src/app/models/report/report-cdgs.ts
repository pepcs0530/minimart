export interface Report {
    reportName: string;
    mainSqlConditions?: { [key: string]: any };
    userParameters?: { [key: string]: any };
}
