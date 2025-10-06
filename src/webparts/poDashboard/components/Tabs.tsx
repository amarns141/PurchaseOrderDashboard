import * as React from 'react';

const Tabs: React.FC<{active: string; setActive: (t: string) => void}> = ({active, setActive}) =>{

    const tabs = ["Transaction", "Pending", "Archived", "Comments"];
    
    return(
        <>
        <div className="flex space-x-4 border-b mb-4">
        {tabs.map(tab => (
            <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 ${active === tab ? "border-b-2 border-blue-600 font-bold" : "text-gray-500"}`}
            >
            {tab}
            </button>
        ))}
        </div>
        </>
    );
}

export default Tabs;