import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

 import { getSP } from '../Services/pnpjsConfig';
 import { SPFI } from "@pnp/sp";
 import { WebPartContext } from '@microsoft/sp-webpart-base';
 //import "@pnp/sp/items/";   // IMPORTANT


interface IPurchaseOrderDashboardProps {
  _props: any; 
}

export interface IPOItem {
  Id: number;
  Title: string;
  Status: string;
  Created: string;
  Author: { Title: string };
}

//-------- Get Current User Id ------------//
export async function getCurrentUser(_props:any, sp:SPFI){
  const user = await _props.sp.web.currentUser();
  const currentUserId = user.Id;
  return currentUserId;
}

//---------- Get All POC Items ----------//
export async function getAllPOItems(context: WebPartContext, _props:any, sp: SPFI, userId:string) {
  // let allItems1: any[] = [];
  // let paged = await _props.sp.web.lists
  //   .getById(_props.listPOTransListId)
  //   .items
  //   .select(
  //     "Id","Title","Status","PONumber","Created","VendorName","Priority",
  //     "ApprovalType/Id","ApprovalType/Title",
  //     "RequesterName/Id","RequesterName/Title",
  //     "AssignedToIds","AssignedTo/Id","AssignedTo/Title",
  //     "Author/Id","Author/Title"
  //   )
  //   .expand("RequesterName","AssignedTo","ApprovalType","Author")
  //   .filter(`Author/Id eq ${userId} or AssignedTo/Id eq ${userId}`)
  //   .top(500)();  // fetch first 500

  // allItems1.push(...paged);

  // while (paged.hasNext) {
  //   paged = await paged.getNext();
  //   allItems1.push(...paged);
  // }
  // console.log(allItems1, "allItems1");
  
  //-----------------------
  const allItems: any[] = [];

  for await (const items of _props.sp.web.lists.getById(_props.listPOTransListId)
    .items
    .select("Id",  "Title",  "Status",  "PONumber",  "Created",  "VendorName",  "Priority",  "ApprovalType/Id","AssignedToIds",  
      "ApprovalType/Title",  "RequesterName/Id",  "RequesterName/Title",  "AssignedTo/Id", "Author/Id", "Author/Title",  
      "AssignedTo/Title","AssignedTo/Id","AssignedTo/Title")
    .expand("RequesterName","AssignedTo","ApprovalType","Author","AssignedTo")
    //.filter(`Author/Id eq ${userId} or AssignedTo/Id eq ${userId}`)
    .top(1000)) {
    allItems.push(...items);
  }
  console.log("allItems : ",allItems);

  // prepare grouped data
  const result = {
    allItems,
    myRequests: allItems.filter(
      item => item.Author.Id === userId
    ),
    myPendingRequests: allItems.filter(
      item => (item.Author.Id === userId && item.Status === "Pending")
    ),
    myCompletedRequests: allItems.filter(
      item => (item.Author.Id === userId && item.Status === "Approved")
    ),
    assigneToMe: allItems.filter(
      //item => item.Status === "Pending"//item.AssignedToIds.includes(userId)
      //item => item?.AssignedToIds.toLowerCase().includes(userId)
      item => (
        item?.AssignedToIds?.split(';')
          .filter((x: string) => x)     
          .map((x: string) => Number(x))
          .includes(userId)
      )
    ),
    assigneToMePending: allItems.filter(
      //item => item.Status === "Pending"// (item.AssignedToIds.includes(userId) && item.Status === "Pending")
      //item => (item?.AssignedToIds.toLowerCase().includes(userId) && item.Status === "Pending")
      item => (
        (item?.AssignedToIds?.split(';')
          .filter((x: string) => x)     
          .map((x: string) => Number(x))
          .includes(userId))
        && item.Status === "Pending"
      )
    ),
    assigneToMeCompleted: allItems.filter(
      //item => item.Status === "Pending"// (item.AssignedToIds.includes(userId) && item.Status === "Approved")
      //item => (item?.AssignedToIds.toLowerCase().includes(userId) && item.Status === "Approved")
      item => (
        (item?.AssignedToIds?.split(';')
          .filter((x: string) => x)     
          .map((x: string) => Number(x))
          .includes(userId))
        && item.Status === "Approved"
      )
    ),



    myPending: allItems.filter(
      item => item.Status === "Pending" 
    ),
    myCompleted: allItems.filter(
      item => item.Status === "Approved" 
    ),
    assignedToMePending: allItems.filter(
      item => item.Status === "Pending" 
    ),
    assignedToMeCompleted: allItems.filter(
      item => item.Status === "Approved" 
    ),
  };
  return result;
}
