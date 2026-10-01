import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';
import AntDateRangePicker from '../components/AntDateRangePicker';
import CustomDropdown from '../components/CustomDropdown';

import ALARM_HISTORY_DATA from '../data/alarmData';

const SHIFT_OPTIONS = ['All Shift', 'Shift 1', 'Shift 2', 'Shift 3'];

export default function AlarmHistoryPage({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('All Shift');
  const [dateRange, setDateRange] = useState(null);
  const [sortField, setSortField] = useState('no');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    return ALARM_HISTORY_DATA.filter((item) => {
      // Search term filter (Alarm Code or Alarm Message)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(query);
        const matchMessage = item.message.toLowerCase().includes(query);
        if (!matchCode && !matchMessage) return false;
      }

      // Shift filter
      if (selectedShift && selectedShift !== 'All Shift' && selectedShift !== 'All' && item.shift !== selectedShift) {
        return false;
      }

      // Date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.rawTimestamp || item.timestamp, ['YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mm']);
        if (itemDate.isBefore(dateRange[0], 'day') || itemDate.isAfter(dateRange[1], 'day')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'no') {
        return sortDirection === 'asc' ? a.no - b.no : b.no - a.no;
      }
      if (sortField === 'code') {
        return sortDirection === 'asc'
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      }
      if (sortField === 'message') {
        return sortDirection === 'asc'
          ? a.message.localeCompare(b.message)
          : b.message.localeCompare(a.message);
      }
      if (sortField === 'duration') {
        const durA = a.rawDuration || a.duration;
        const durB = b.rawDuration || b.duration;
        return sortDirection === 'asc' ? durA.localeCompare(durB) : durB.localeCompare(durA);
      }
      if (sortField === 'timestamp') {
        const timeA = dayjs(a.rawTimestamp || a.timestamp).valueOf();
        const timeB = dayjs(b.rawTimestamp || b.timestamp).valueOf();
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  }, [searchTerm, selectedShift, dateRange, sortField, sortDirection]);

  // Pagination calculation
  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  const endIndex = Math.min(startIndex + pageSize, totalEntries);

  return (
    <div className="space-y-5">
      {/* Top Header Card matching user screenshot */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1E232F]">Alarm History</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            View and monitor historical machine alarms
          </p>
        </div>

        {/* Breadcrumb matching user screenshot */}
        <div className="flex items-center text-xs font-medium select-none">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-[#00A854] transition-colors cursor-pointer"
          >
            Machine Status
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1.5 flex-shrink-0" />
          <span className="text-[#00A854] font-semibold">Alarm History</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm space-y-4">
        {/* Filter Bar matching user screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input with Search Icon & Clear Button */}
          <div className="relative w-64 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#D0D5DD] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Filters: Shift Dropdown & Date Range Picker */}
          <div className="flex items-center gap-3">
            <div className="w-28">
              <CustomDropdown
                value={selectedShift}
                onChange={(val) => {
                  setSelectedShift(val);
                  setCurrentPage(1);
                }}
                options={SHIFT_OPTIONS}
                placeholder="All Shift"
              />
            </div>

            <AntDateRangePicker
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                setCurrentPage(1);
              }}
              format="DD/MM/YYYY"
              placeholder={['Start date', 'End date']}
              className="w-[260px] sm:w-[280px]"
            />
          </div>
        </div>

        {/* Data Table matching standard with equal column widths */}
        <div className="overflow-x-auto border border-[#D0D5DD] rounded-lg">
          <table className="w-full table-fixed text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="bg-[#F2F2F7] border-b border-[#D0D5DD] text-[#23262B] font-semibold text-sm select-none">
                <th
                  onClick={() => handleSort('no')}
                  className="py-3.5 px-4 w-1/5 cursor-pointer hover:bg-gray-200/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>No</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('code')}
                  className="py-3.5 px-4 w-1/5 cursor-pointer hover:bg-gray-200/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Alarm Code</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('message')}
                  className="py-3.5 px-4 w-1/5 cursor-pointer hover:bg-gray-200/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Alarm Message</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('duration')}
                  className="py-3.5 px-4 w-1/5 cursor-pointer hover:bg-gray-200/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Duration</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('timestamp')}
                  className="py-3.5 px-4 w-1/5 cursor-pointer hover:bg-gray-200/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Timestamp</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D0D5DD] bg-white">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.no}
                    className="hover:bg-gray-50/70 transition-colors text-gray-800"
                  >
                    <td className="py-3.5 px-4 font-medium text-gray-700 text-sm leading-5">{row.no}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 text-sm leading-5">{row.code}</td>
                    <td className="py-3.5 px-4 text-gray-700 uppercase tracking-tight truncate text-sm leading-5" title={row.message}>
                      {row.message}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-sm leading-5">
                      {row.duration}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-sm leading-5">
                      {row.timestamp}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    No alarms found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination matching user screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs select-none">
          {/* Entries Count Text */}
          <div className="text-gray-500 font-medium">
            Showing <span className="font-semibold text-gray-700">{totalEntries > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">{endIndex}</span> of{' '}
            <span className="font-semibold text-gray-700">{totalEntries}</span> entries
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-3">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className={`w-8 h-8 rounded-lg border border-[#D0D5DD] flex items-center justify-center transition-colors ${
                safeCurrentPage <= 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Indicator (1 / 10) */}
            <span className="text-gray-700 font-semibold px-1">
              {safeCurrentPage} <span className="text-gray-400 font-normal">/</span> {totalPages}
            </span>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className={`w-8 h-8 rounded-lg border border-[#D0D5DD] flex items-center justify-center transition-colors ${
                safeCurrentPage >= totalPages
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Show Entries Dropdown matching screenshot */}
            <div className="flex items-center gap-1.5 ml-2 text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 border border-[#D0D5DD] rounded-lg bg-white text-xs font-medium text-gray-700 focus:outline-none focus:border-[#00A854]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
