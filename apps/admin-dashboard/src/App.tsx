import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TenantProvisioning from './pages/TenantProvisioning';
import ObservabilityHub from './pages/ObservabilityHub';
import Layout from './components/Layout';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/provisioning" element={<TenantProvisioning />} />
                    <Route path="/observability" element={<ObservabilityHub />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
