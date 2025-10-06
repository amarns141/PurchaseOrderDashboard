declare interface IPoDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;

  //----- New Fields
  ListFiledLablePOTrans: string;
  ListFiledLablePOComment: string;
  ListFiledLablePOTransArchival: string;
  ListFiledLablePOTransPending: string;
  POFormUrl: string;
  ArchivalPODashboardUrl: string;
  NewPORequest: string;
}

declare module 'PoDashboardWebPartStrings' {
  const strings: IPoDashboardWebPartStrings;
  export = strings;
}
