import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MachineStatusPage from './pages/MachineStatusPage';
import AlarmHistoryPage from './pages/AlarmHistoryPage';
import PlanningProductionPage from './pages/PlanningProductionPage';
import NotificationPage from './pages/NotificationPage';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import MasterDataLinePage from './pages/MasterDataLinePage';
import MasterDataMachinePage from './pages/MasterDataMachinePage';
import MasterDataShiftPage from './pages/MasterDataShiftPage';
import RegisterLinePage from './pages/RegisterLinePage';

import {
  INITIAL_USERS,
  INITIAL_ROLES,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { RealtimeProvider } from './context/RealtimeContext';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [plcConnected, setPlcConnected] = useState(true);

  // Application Data States
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const isOperator =
    currentUser?.role === 'Operator' ||
    currentUser?.username === 'suep_astemo' ||
    currentUser?.idCard === 'AST-OP-002';

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveMenu('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNavigate = (menu) => {
    if (menu === 'notification') return; // Notification hidden for now
    // Suep (Operator) can only view Dashboard, Machine Status, Alarm History
    const operatorAllowed = ['dashboard', 'machine-status', 'alarm-history'];
    if (isOperator && !operatorAllowed.includes(menu)) {
      return;
    }
    setActiveMenu(menu);
  };

  const togglePlc = () => {
    setPlcConnected((prev) => !prev);
  };

  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <RealtimeProvider>
      <Layout
        activeMenu={activeMenu}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentUser={currentUser}
        plcConnected={plcConnected}
        onTogglePlc={togglePlc}
        unreadCount={unreadCount}
      >
        {/* APPLICATION PAGES */}
        {activeMenu === 'dashboard' && <DashboardPage />}

        {activeMenu === 'machine-status' && (
          <MachineStatusPage onNavigateAlarmHistory={() => handleNavigate('alarm-history')} />
        )}

        {activeMenu === 'alarm-history' && (
          <AlarmHistoryPage onBack={() => handleNavigate('machine-status')} />
        )}

        {(!isOperator || activeMenu === 'planning-production') && activeMenu === 'planning-production' && (
          <PlanningProductionPage />
        )}

        {/* Notification Page - Hidden for now */}
        {/* activeMenu === 'notification' && (
          <NotificationPage
            notifications={notifications}
            onUpdateNotifications={setNotifications}
          />
        ) */}

        {/* MANAGEMENT PAGES (Superadmin & Admin) */}
        {!isOperator && activeMenu === 'user-management' && (
          <UserManagementPage
            users={users}
            onUpdateUsers={setUsers}
            roles={roles}
          />
        )}

        {!isOperator && activeMenu === 'role-management' && (
          <RoleManagementPage
            roles={roles}
            onUpdateRoles={setRoles}
          />
        )}

        {/* DATABASE PAGES (Superadmin & Admin) */}
        {!isOperator && activeMenu === 'master-data-line' && (
          <MasterDataLinePage />
        )}

        {!isOperator && activeMenu === 'master-data-machine' && (
          <MasterDataMachinePage />
        )}

        {!isOperator && activeMenu === 'master-data-shift' && (
          <MasterDataShiftPage />
        )}

        {!isOperator && activeMenu === 'register-line' && (
          <RegisterLinePage />
        )}
      </Layout>
    </RealtimeProvider>
  );
}
