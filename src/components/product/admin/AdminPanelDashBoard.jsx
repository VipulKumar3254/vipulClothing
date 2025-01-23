import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanelDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="card p-4 cursor-pointer"onClick={()=>{
            navigate("/adminPanel")
        }}  
        style={{cursor:"pointer"}}
        >
        <h1 className="text-center">Admin Panel</h1>
        <p className="text-center">Welcome to the admin dashboard!</p>
        {/* Add your admin panel content here */}
      </div>
    );
};

export default AdminPanelDashboard;