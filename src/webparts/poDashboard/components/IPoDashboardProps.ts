
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";

export interface IPoDashboardProps {
  sp: SPFI;
  listPOTransListId: string;
  listPOCommentListId: string;
  listPOTransArchivalListId: string;
  listPOTransPendingListId :string;
  poFormUrl: string;
  archivalPODashboardUrl: string;
  newRequestUrl : string;
  context:WebPartContext;
}
