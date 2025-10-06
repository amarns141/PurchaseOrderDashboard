import * as React from 'react';
import { useState, useEffect } from 'react';
import { PrimaryButton, DefaultButton, Pivot, PivotItem, TextField, DetailsList, IColumn, Stack, Label, Separator, IconButton } from '@fluentui/react';

import { SPFI } from "@pnp/sp";
import { getAllPOItems, getCurrentUser } from '../../../Services/PODashboardService';
 import { WebPartContext } from '@microsoft/sp-webpart-base';

//------- Getting Request counts ---------//

interface IPurchaseOrderDashboardProps {
  _props: any; 
}

interface IPOResult {
  allItems: any[];
  myRequests: any[];
  myPendingRequests:any[];
  myCompletedRequests: any[];
  assigneToMe: any[];
  assigneToMePending :any [];
  assigneToMeCompleted: any[];
  myPending: any[];
  myCompleted: any[];
  assignedToMePending: any[];
  assignedToMeCompleted: any[];
}

const PurchaseOrderDashboard: React.FC<IPurchaseOrderDashboardProps> = ({_props}) => {
    console.log(_props.poFormUrl,"poFormUrl");

    const [search, setSearch] = useState('');
    const [selectedTab, setSelectedTab] = useState('myRequest');
    const [poData, setPoData] = useState<IPOResult | null>( null);
    const [filterData, setFilterData] = useState<any[]>([]);
    const [currentUserId, SetCurrentUserId] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const columns: IColumn[] = [

      { key: 'column1', name: 'Requester Name', fieldName: 'RequesterName', minWidth: 100, maxWidth: 150, isResizable: true, onRender: (item) => item.RequesterName?.Title },
      { key: 'column2', name: 'PO / Document', fieldName: 'PONumber', minWidth: 100, maxWidth: 120, isResizable: true },
      { key: 'column3', name: 'Requested On', fieldName: 'Created', minWidth: 140, maxWidth: 160, isResizable: true },
      { key: 'column4', name: 'Vendor Name', fieldName: 'VendorName', minWidth: 150, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Priority', fieldName: 'Priority', minWidth: 80, maxWidth: 100, isResizable: true },
      { key: 'column6', name: 'Status', fieldName: 'Status', minWidth: 80, maxWidth: 100, isResizable: true },
      { key: 'column7', name: 'Approval Type', fieldName: 'ApprovalType', minWidth: 100, maxWidth: 120, isResizable: true, onRender: (item) => item.ApprovalType?.Title },
      { key: 'column8', name: 'Assigned To', fieldName: 'AssignedTo', minWidth: 120, maxWidth: 150, isResizable: true, 
        onRender: (item: any) => (
          item.AssignedTo && Array.isArray(item.AssignedTo) 
            ? item.AssignedTo.map((user: any) => user.Title).join(", ") 
            : ""  
        ) 
      },
      { key: 'column9', name: 'Action', fieldName: 'Action', minWidth: 120, maxWidth: 150, isResizable: true, 
        onRender: (item: any) => {
          const isEdit = selectedTab === "pending" || selectedTab === "myRequest";
          const formUrl = `${_props.poFormUrl}${item.Id}&isEdit=${isEdit}`;
          if (selectedTab === "myRequest") {
            const editUrl = `${_props.poFormUrl}${item.Id}&isEdit=true`;
            const viewUrl = `${_props.poFormUrl}${item.Id}&isEdit=false`;
            return (
              <div style={{ display: "flex", gap: 8 }}>
                <a href={editUrl} target="_blank" rel="noopener noreferrer">
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title="Edit Request"
                    ariaLabel="Edit Request"
                  />
                </a>
                <a href={viewUrl} target="_blank" rel="noopener noreferrer">
                  <IconButton
                    iconProps={{ iconName: 'View' }}
                    title="View Request"
                    ariaLabel="View Request"
                  />
                </a>
              </div>
            );
          }
        if (selectedTab === "pending") {
          return (
            <a href={formUrl} target="_blank" rel="noopener noreferrer">
              <IconButton
                iconProps={{ iconName: 'Edit' }}
                title="View Request"
                ariaLabel="View Request"
              />
            </a>
          );
        }
        return (
            <a href={formUrl} target="_blank" rel="noopener noreferrer">
              <IconButton
                iconProps={{ iconName: 'View' }}
                title="View Request"
                ariaLabel="View Request"
              />
            </a>
          );
        }
      },
    ];

    //---------- Search Data --------------//
    const handleSearch = (_event: any, newValue?: string) => {
      const text = newValue || "";
      setSearch(text);
      setCurrentPage(1);
      var searchData:any[] = poData?.allItems || [];

      switch (selectedTab) {
        case "myRequest":
          searchData = poData?.allItems.filter(item => (item.Status =="Pending" && item.RequesterName?.Id === currentUserId)) || [];
          break;

        case "pending":
          searchData = poData?.allItems.filter(item => (item.Status =="Approved" && item.RequesterName?.Id === currentUserId)) || [];
          break;

        case "all":
          searchData = poData?.allItems.filter(item => item )|| [];
          break;
        
        default:
          searchData = poData?.allItems.filter(item => (item.Status =="Pending" && item.RequesterName?.Id === currentUserId)) || [];
          break;
      }

      setFilterData(
        (searchData || []).filter(item =>
          item.Title?.toLowerCase().includes(text.toLowerCase()) ||
          item.PONumber?.toLowerCase().includes(text.toLowerCase()) ||
          item.VendorName?.toLowerCase().includes(text.toLowerCase()) ||
          item.RequesterName.Title?.toLowerCase().includes(text.toLowerCase())
        )
      );
    };

    //---------- Get PO Details -----------//
    async function loadPOData() {
      //-----getCurrentUser
      const userId = await getCurrentUser(_props, _props.sp as SPFI);
      SetCurrentUserId(userId);

      const result = await getAllPOItems(_props.context, _props, _props.sp as SPFI, userId);
      setPoData(result);
    };
    //---------- On click of Pivot data --------//
    const handlePivotClick = (item?: PivotItem) => {
      setCurrentPage(1);
      switch (item?.props.itemKey) {
        case "myRequest":
          setSelectedTab("myRequest");
          setFilterData(poData?.allItems.filter(item => (item.Status =="Pending" && item.RequesterName?.Id === currentUserId)) || []);
          break;

        case "pending":
          setSelectedTab("pending");
          //setFilterData(poData?.allItems.filter(item => (item.Status =="Approved" && item.RequesterName?.Id === currentUserId)) || []);
          setFilterData(poData?.assigneToMePending || []);
          break;

        case "all":
          setSelectedTab("all");
          setFilterData(poData?.allItems.filter(item => item )|| []);
          break;
          
        default:
          setSelectedTab("myRequest");
          setFilterData(poData?.allItems.filter(item => (item.Status =="Pending" && item.RequesterName?.Id === currentUserId)) || []);
          break;
      }
    };

    
    // Calculate pagination
  const totalPages = Math.ceil(filterData.length / entriesPerPage);
  const paginatedData = filterData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  useEffect(() => { loadPOData();}, [_props]);
  useEffect(()=> { 
    setSelectedTab("myRequest");
    setFilterData(poData?.allItems.filter(item => (item.Status =="Pending" && item.RequesterName?.Id === currentUserId)) || []); 
  }, [poData]);

  const handleNewPOClick = () => {
    window.open(_props.newRequestUrl, "_blank");
  };
  const handleArchivalPOClick = () => {
    window.open(_props.archivalPODashboardUrl, "_blank");
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <Stack horizontal verticalAlign="center" styles={{ root: { backgroundColor: '#2a6ebb', color: 'white', padding: 10, borderRadius: 4 } }}>
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Purchase Order Dashboard</span>
        <div style={{ marginLeft: 'auto' }}>
          <DefaultButton text="Archival PO Dashboard" onClick={handleArchivalPOClick} styles={{ root: { marginRight: 8 } }}  />
          <DefaultButton text="New PO Request" onClick={handleNewPOClick} />
        </div>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 20 }} style={{ marginTop: 20 }}>
        <Stack styles={{ root: { backgroundColor: '#d6e8f5', padding: 15, flex: 1, borderRadius: 4 } }}>
          <Label>My Requests <span style={{ backgroundColor: '#316a9a', borderRadius: 12, padding: '2px 8px', color: 'white', fontSize: 12, float: 'right' }}>
            { poData ?.myRequests.length || 0 }</span></Label>
          <Stack horizontal tokens={{ childrenGap: 15 }} style={{ marginTop: 10 }}>
            <PrimaryButton text={`Pending ${poData?.myPendingRequests.length || 0}`} />
            <PrimaryButton text={`Completed ${poData?.myCompletedRequests.length || 0}`} />
          </Stack>
        </Stack>

        <Stack styles={{ root: { backgroundColor: '#d6e8f5', padding: 15, flex: 1, borderRadius: 4 } }}>
          <Label>Assigned To Me <span style={{ backgroundColor: '#316a9a', borderRadius: 12, padding: '2px 8px', color: 'white', fontSize: 12, float: 'right' }}>
            { poData?.assigneToMe.length || 0 }</span></Label>
          <Stack horizontal tokens={{ childrenGap: 15 }} style={{ marginTop: 10 }}>
            <PrimaryButton text={`Pending ${poData?.assigneToMePending.length || 0}`} />
            <PrimaryButton text={`Completed ${poData?.assigneToMeCompleted.length || 0}`} />
          </Stack>
        </Stack>
      </Stack>

      <Pivot style={{ marginTop: 20 }} onLinkClick={handlePivotClick}>
        <PivotItem headerText="My Request" itemKey="myRequest" />
        <PivotItem headerText="Pending Request" itemKey="pending" />
        <PivotItem headerText="All Request" itemKey="all" />
      </Pivot>

      <Stack horizontal verticalAlign="center" style={{ marginTop: 20 }}>
        <Label>Show Entries:</Label>
        <select
          style={{ marginLeft: 10 }}
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to page 1
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <Label style={{ marginLeft: 'auto' }}>Search:</Label>
        <TextField
          styles={{ root: { width: 200, marginLeft: 8 } }}
          value={ search }
          onChange = { handleSearch }
          placeholder="Search..."
        />
      </Stack>

      <DetailsList
        items={ paginatedData }
        columns={columns}
        setKey="set"
        layoutMode={0}
        selectionMode={0}
        styles={{ root: { marginTop: 10 } }}
      />

      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrderDashboard;
