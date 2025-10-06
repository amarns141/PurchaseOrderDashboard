import * as React from 'react';
import type { IPoDashboardProps } from './IPoDashboardProps';
import PurchaseOrderDashboard from './PurchaseOrderDashboard';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css")


const PoDashboard: React.FC<IPoDashboardProps> = (_props) => {
  return(
    <>
      <PurchaseOrderDashboard _props = {_props}></PurchaseOrderDashboard>
    </>
  )
}

export default PoDashboard;
