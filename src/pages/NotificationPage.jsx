import React, { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';
import AntDateRangePicker from '../components/AntDateRangePicker';
import Toast from '../components/Toast';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export default function NotificationPage({
  notifications: propNotifications,
  onUpdateNotifications
}) {
  const [localNotifications, setLocalNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifications = propNotifications || localNotifications;
  const updateNotifications = onUpdateNotifications || setLocalNotifications;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);

  // Helper to render bold keywords in description matching Figma
  const renderDescription = (text) => {
    if (!text) return '';
    const regex = /(8,500 RPM|85°C|18%|X-axis servo|positive travel limit|118%|FANUC 7)/g;
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className="font-semibold text-gray-800">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // Filter notifications based on tab and search
  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.isRead && !n.read;
    const matchTab = activeTab === 'all' || isUnread;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.machine && n.machine.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTab && matchSearch;
  });

  // Toggle selection for a row checkbox
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mark selected or all notifications as read
  const handleMarkAsRead = () => {
    if (selectedIds.length > 0) {
      updateNotifications(
        notifications.map((n) =>
          selectedIds.includes(n.id) ? { ...n, isRead: true, read: true } : n
        )
      );
      setSelectedIds([]);
      setToast({
        type: 'success',
        title: 'Success',
        message: 'Selected notifications marked as read.'
      });
    } else {
      updateNotifications(
        notifications.map((n) => ({ ...n, isRead: true, read: true }))
      );
      setToast({
        type: 'success',
        title: 'Success',
        message: 'All notifications marked as read.'
      });
    }
  };

  return (
    <>
      <div className="space-y-5 font-sans">
        {/* Top Header Card matching Figma exact Header */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Notification</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View your latest notifications and warnings
            </p>
          </div>

          {/* Segmented Pill Tabs matching Figma */}
          <div className="bg-[#F2F4F7] p-1 rounded-full flex items-center gap-1 select-none">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#00A854] text-white shadow-xs'
                  : 'text-[#475467] hover:text-[#1E232F]'
              }`}
            >
              All Notification
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-[#00A854] text-white shadow-xs'
                  : 'text-[#475467] hover:text-[#1E232F]'
              }`}
            >
              Unread Notification
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm space-y-4">
          {/* Top Filter and Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-[38px] pl-9 pr-8 bg-white border border-[#D0D5DD] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Group: Date Range Picker & Mark As Read Button */}
            <div className="flex flex-wrap items-center gap-3">
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                placeholder={['Start date', 'End date']}
                style={{ height: '38px' }}
              />

              <button
                type="button"
                onClick={handleMarkAsRead}
                className="h-[38px] px-5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center"
              >
                Mark As Read
              </button>
            </div>
          </div>

          {/* Notifications List Container matching Figma */}
          <div className="border border-[#E4E7EC] rounded-xl overflow-hidden divide-y divide-[#F2F4F7]">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">No notifications found</p>
                <p className="text-xs text-gray-400 mt-0.5">You are all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const isUnread = !n.isRead && !n.read;
                const isChecked = selectedIds.includes(n.id);

                return (
                  <div
                    key={n.id}
                    className={`py-3.5 px-4 flex items-center justify-between gap-4 transition-colors ${
                      isUnread ? 'bg-[#F6FEF9]' : 'bg-white hover:bg-gray-50/50'
                    }`}
                  >
                    {/* Left: Checkbox + Alert Icon + Title & Description */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Custom Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(n.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#00A854] focus:ring-[#00A854] cursor-pointer flex-shrink-0 accent-[#00A854]"
                      />

                      {/* Red Exclamation Badge matching Figma (double ring) */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isUnread ? 'bg-[#FEE4E2]' : 'bg-[#FEE4E2]/60'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                            isUnread ? 'bg-[#F04438]' : 'bg-[#F04438]/70'
                          }`}
                        >
                          !
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            isUnread ? 'text-[#1E232F]' : 'text-[#475467]'
                          }`}
                        >
                          {n.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {renderDescription(n.description)}
                        </p>
                      </div>
                    </div>

                    {/* Right: Unread Indicator Dot & Timestamp */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {isUnread ? (
                        <span className="w-2 h-2 rounded-full bg-[#00A854]" />
                      ) : (
                        <span className="w-2 h-2" />
                      )}
                      <span className="text-xs text-gray-400 font-normal">
                        {n.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
