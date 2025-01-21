import React from 'react';


import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute: React.FC = () => {

    const user = localStorage.getItem("user")
    return user ? <Outlet /> : <Navigate to="/login" />;


};

export default ProtectRoute;
