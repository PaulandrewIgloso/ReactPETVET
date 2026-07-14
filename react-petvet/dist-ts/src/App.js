import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/layout/auth/LoginForm';
import DashboardPage from './features/dashboard/Dashboardpage';
import './App.css';
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginForm, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) })] }) }));
}
export default App;
