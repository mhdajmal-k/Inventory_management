import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectRoute from './ProtuctRoute';
import LoadingFallback from '../components/Loading';


const LandingPage = lazy(() => import('../pages/LandingPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const CustomerManagementPage = lazy(() => import('../pages/Customers'));
const Sales = lazy(() => import('../pages/Sales'));
const CreateSales = lazy(() => import('../pages/CreateSales'));
const SalesReportPreview = lazy(() => import('../pages/ViewSalesData'));
const ReportPage = lazy(() => import('../pages/Report'));


const PageRoutes = () => {
    return (
        <div>
            <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path='/' element={<LandingPage />} />
                        <Route element={<PublicRoute />}>
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/login" element={<LoginPage />} />
                        </Route>
                        <Route element={<ProtectRoute />}>
                            <Route path='/inventory' element={<InventoryPage />} />
                            <Route path='/customers' element={<CustomerManagementPage />} />
                            <Route path='/sales' element={<Sales />} />
                            <Route path='/CreateSales' element={<CreateSales />} />
                            <Route path='/viewSales/:id' element={<SalesReportPreview />} />
                            <Route path='/reports' element={<ReportPage />} />
                        </Route>
                        <Route path="*" element={<h1>Not Found</h1>} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
};

export default PageRoutes;
