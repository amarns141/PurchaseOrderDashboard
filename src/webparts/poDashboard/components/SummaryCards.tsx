import * as React from 'react';

const SummaryCards: React.FC<{summary: any}> = ({summary}) =>{

    return(
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-blue-100 rounded shadow text-center">
            <h3 className="font-bold text-lg">{summary.total}</h3>
            <p>Total POs</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow text-center">
            <h3 className="font-bold text-lg">{summary.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="p-4 bg-green-100 rounded shadow text-center">
            <h3 className="font-bold text-lg">{summary.archived}</h3>
            <p>Archived</p>
          </div>
          <div className="p-4 bg-gray-100 rounded shadow text-center">
            <h3 className="font-bold text-lg">{summary.comments}</h3>
            <p>Comments</p>
          </div>
    </div>
    );
}
export default SummaryCards;