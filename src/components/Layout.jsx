import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Cpu,
  CalendarDays,
  Bell,
  Users,
  ShieldCheck,
  Database,
  Layers,
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  MoreVertical
} from 'lucide-react';
import astemoBrand from '../assets/astemo-brand.png';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export default function Layout({
  activeMenu,
  onNavigate,
  onLogout,
  currentUser,
  plcConnected = true,
  onTogglePlc,
  unreadCount = INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [masterDataOpen, setMasterDataOpen] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isOperator =
    currentUser?.role === 'Operator' ||
    currentUser?.username === 'suep_astemo' ||
    currentUser?.idCard === 'AST-OP-002';

  // Realtime clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return {
      dateStr: `${dayName}, ${day} ${month} ${year}`,
      timeStr: `${hh}:${mm}:${ss}`
    };
  };

  const { dateStr, timeStr } = formatDate(currentTime);

  const isMasterDataActive =
    activeMenu === 'master-data-line' ||
    activeMenu === 'master-data-machine' ||
    activeMenu === 'master-data-shift' ||
    activeMenu === 'master-data-model';

  const isRegisterActive = activeMenu === 'register-line';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8F9FC] overflow-hidden">
      {/* Top Navbar - Fixed at top, never scrolls */}
      <header className="h-[72px] bg-white border-b border-[#E4E7EC] px-6 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => onNavigate('dashboard')}
          >
            <img
              src={astemoBrand}
              alt="Hitachi Astemo - OEE Machine Status"
              className="h-[40px] w-auto object-contain"
            />
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Top Right: Realtime Date & Time matching user request */}
        <div className="flex items-center gap-2.5 text-xl text-[#475467] font-medium select-none">
          <span>{dateStr}</span>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-[#1E232F]">{timeStr}</span>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar - Pinned stay, never scrolls with page content */}
        <aside
          className={`${sidebarOpen ? 'w-64' : 'w-20'
            } h-full bg-white border-r border-[#E4E7EC] flex flex-col justify-between transition-all duration-300 ease-in-out select-none flex-shrink-0 z-20`}
        >
          {/* Menu Sections */}
          <div className="py-6 px-4 space-y-6 overflow-y-auto">
            {/* APPLICATION */}
            <div>
              {sidebarOpen && (
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2 px-2">
                  APPLICATION
                </p>
              )}
              <div className="space-y-1">
                {/* Dashboard */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'dashboard'
                      ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                      : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>Dashboard</span>}
                </button>

                {/* Machine Status */}
                <button
                  onClick={() => onNavigate('machine-status')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'machine-status' || activeMenu === 'alarm-history'
                      ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                      : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  title="Machine Status"
                >
                  <Cpu className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>Machine Status</span>}
                </button>

                {/* Planning Production */}
                <button
                  onClick={() => onNavigate('planning-production')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'planning-production'
                      ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                      : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  title="Planning Production"
                >
                  <CalendarDays className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>Planning Production</span>}
                </button>

                {/* Notification (Hidden for now) */}
              </div>
            </div>

            {/* MANAGEMENT (User Management & Role Management - Hidden for 1 platform auth) */}
            {/* {!isOperator && (
              <div>
                {sidebarOpen && (
                  <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2 px-2">
                    MANAGEMENT
                  </p>
                )}
                <div className="space-y-1">
                  <button
                    onClick={() => onNavigate('user-management')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeMenu === 'user-management'
                        ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                        : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title="User Management"
                  >
                    <Users className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>User Management</span>}
                  </button>

                  <button
                    onClick={() => onNavigate('role-management')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeMenu === 'role-management'
                        ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                        : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title="Role Management"
                  >
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>Role Management</span>}
                  </button>
                </div>
              </div>
            )} */}

            {/* DATABASE (Superadmin & Admin) */}
            {!isOperator && (
              <div>
                <div className="flex items-center justify-between px-2 mb-2">
                  {sidebarOpen && (
                    <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                      DATABASE
                    </p>
                  )}
                  {sidebarOpen && (
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>

                <div className="space-y-2">
                  {/* Master Data Collapsible Treeview */}
                  <div>
                    <button
                      onClick={() => {
                        if (sidebarOpen) {
                          setMasterDataOpen(!masterDataOpen);
                        } else {
                          onNavigate('master-data-line');
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isMasterDataActive
                          ? 'text-[#00A854] font-semibold'
                          : 'text-[#475467] hover:bg-gray-50'
                        }`}
                      title="Master Data"
                    >
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Master Data</span>}
                      </div>
                      {sidebarOpen &&
                        (masterDataOpen ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        ))}
                    </button>

                    {/* Master Data Treeview Sub-items */}
                    {sidebarOpen && masterDataOpen && (
                      <div className="relative pl-[36px] pt-1 space-y-1">
                        {/* Tree vertical guide line */}
                        <div className="absolute left-[20px] top-1 bottom-3 w-[1.5px] bg-[#D0D5DD] pointer-events-none" />

                        {/* Line */}
                        <div className="relative flex items-center">
                          <div className="absolute left-[-16px] top-1/2 w-3.5 h-[1.5px] bg-[#D0D5DD] pointer-events-none" />
                          <button
                            onClick={() => onNavigate('master-data-line')}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'master-data-line'
                                ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                                : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <span>Line</span>
                          </button>
                        </div>

                        {/* Machine */}
                        <div className="relative flex items-center">
                          <div className="absolute left-[-16px] top-1/2 w-3.5 h-[1.5px] bg-[#D0D5DD] pointer-events-none" />
                          <button
                            onClick={() => onNavigate('master-data-machine')}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'master-data-machine'
                                ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                                : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <span>Machine</span>
                          </button>
                        </div>

                        {/* Shift */}
                        <div className="relative flex items-center">
                          <div className="absolute left-[-16px] top-1/2 w-3.5 h-[1.5px] bg-[#D0D5DD] pointer-events-none" />
                          <button
                            onClick={() => onNavigate('master-data-shift')}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'master-data-shift'
                                ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                                : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <span>Shift</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Register Collapsible Treeview */}
                  <div>
                    <button
                      onClick={() => {
                        if (sidebarOpen) {
                          setRegisterOpen(!registerOpen);
                        } else {
                          onNavigate('register-line');
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isRegisterActive
                          ? 'text-[#00A854] font-semibold'
                          : 'text-[#475467] hover:bg-gray-50'
                        }`}
                      title="Register"
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Register</span>}
                      </div>
                      {sidebarOpen &&
                        (registerOpen ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        ))}
                    </button>

                    {/* Register Treeview Sub-items */}
                    {sidebarOpen && registerOpen && (
                      <div className="relative pl-[36px] pt-1 space-y-1">
                        {/* Tree vertical guide line */}
                        <div className="absolute left-[20px] top-1 bottom-3 w-[1.5px] bg-[#D0D5DD] pointer-events-none" />

                        {/* Line */}
                        <div className="relative flex items-center">
                          <div className="absolute left-[-16px] top-1/2 w-3.5 h-[1.5px] bg-[#D0D5DD] pointer-events-none" />
                          <button
                            onClick={() => onNavigate('register-line')}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'register-line'
                                ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                                : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <span>Line</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout at Bottom */}
          <div className="p-4 border-t border-[#E4E7EC]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#FF4D4F] hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-[#FF4D4F]" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Right Section: Content + Footer */}
        <div className="flex-1 flex flex-col justify-between min-w-0 min-h-0 overflow-hidden">
          <main className="p-5 w-full max-w-[1720px] mx-auto flex-1 overflow-y-auto min-h-0">
            {children}
          </main>

          <footer className="w-full bg-white border-t border-[#D0D5DD] px-6 py-4 flex items-center justify-end text-sm text-[#23262B] font-normal select-none flex-shrink-0 z-10">
            <span>Copyright © 2026 PT. Electrindo Inti Dinamika</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
