import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Upload,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown
} from 'lucide-react';
import dayjs from 'dayjs';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import Toast from '../components/Toast';
import PlanningProductionForm from '../components/PlanningProductionForm';
import { INITIAL_PLANNING } from '../data/mockData';

export default function PlanningProductionPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'add'
  const [plans, setPlans] = useState(INITIAL_PLANNING);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [sortField, setSortField] = useState('no');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchPeriod = p.period.toLowerCase().includes(query);
        const matchS1 = p.shift1Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        const matchS2 = p.shift2Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        const matchS3 = p.shift3Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        if (!matchPeriod && !matchS1 && !matchS2 && !matchS3) return false;
      }

      // Date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        if (p.datetime) {
          const itemDate = dayjs(p.datetime, 'DD/MM/YYYY HH:mm');
          if (itemDate.isValid()) {
            if (itemDate.isBefore(dateRange[0], 'day') || itemDate.isAfter(dateRange[1], 'day')) {
              return false;
            }
          }
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'no') {
        valA = a.id;
        valB = b.id;
      } else if (sortField === 'shift1') {
        valA = a.shift1Items[0]?.part || '';
        valB = b.shift1Items[0]?.part || '';
      } else if (sortField === 'qty1') {
        valA = parseInt(a.shift1Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift1Items[0]?.qty || '0', 10);
      } else if (sortField === 'shift2') {
        valA = a.shift2Items[0]?.part || '';
        valB = b.shift2Items[0]?.part || '';
      } else if (sortField === 'qty2') {
        valA = parseInt(a.shift2Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift2Items[0]?.qty || '0', 10);
      } else if (sortField === 'shift3') {
        valA = a.shift3Items[0]?.part || '';
        valB = b.shift3Items[0]?.part || '';
      } else if (sortField === 'qty3') {
        valA = parseInt(a.shift3Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift3Items[0]?.qty || '0', 10);
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });
  }, [plans, searchQuery, dateRange, sortField, sortDirection]);

  const totalEntries = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setCurrentView('add');
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setCurrentView('add');
  };

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? { ...p, ...planData } : p))
      );
      setToast({
        type: 'success',
        title: 'Plan Updated',
        message: `Production plan for ${planData.period} successfully updated.`
      });
    } else {
      setPlans((prev) => [planData, ...prev]);
      setToast({
        type: 'success',
        title: 'Plan Added',
        message: `New production plan for ${planData.period} added successfully.`
      });
    }

    setCurrentView('list');
    setEditingPlan(null);
  };

  const handleDeleteConfirm = () => {
    setPlans(plans.filter((p) => p.id !== deletePlanId));
    setDeletePlanId(null);
    setToast({
      type: 'success',
      title: 'Plan Deleted',
      message: 'Production plan was removed successfully.'
    });
  };

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setShowUploadModal(false);
    setToast({
      type: 'success',
      title: 'Data Uploaded Successfully',
      message: 'Planning production schedule imported from spreadsheet.'
    });
  };

  if (currentView === 'add') {
    return (
      <>
        <PlanningProductionForm
          initialData={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => {
            setCurrentView('list');
            setEditingPlan(null);
          }}
        />
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

  return (
    <>
      <div className="space-y-4 font-sans">
        {/* Top Header Card matching reference screenshot */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Planning Production</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View and manage your production planning data
            </p>
          </div>
        </div>

        {/* Main Content Card matching reference screenshot */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Action Toolbar matching reference screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input on the left */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Date Range, Upload Data, Add Data */}
            <div className="flex items-center gap-3">
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setCurrentPage(1);
                }}
              />

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload Data</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table matching reference screenshot */}
          <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
            <table className="w-full text-left border-collapse text-sm font-sans">
              <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                <tr className="text-[#23262B] font-semibold text-sm select-none">
                  <th
                    onClick={() => handleSort('no')}
                    className="py-3.5 px-4 w-12 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>No</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('period')}
                    className="py-3.5 px-4 min-w-[170px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Period</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift1')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 1</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty1')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift2')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 2</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty2')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift3')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 3</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty3')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] bg-white text-gray-800">
                {paginatedPlans.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      No planning production data found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPlans.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-600 align-middle leading-5">
                        {startIndex + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 align-middle leading-5 max-w-[170px]">
                        {item.period}
                      </td>

                      {/* Shift 1 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift1Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift1Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Shift 2 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift2Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift2Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Shift 3 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift3Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift3Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletePlanId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination matching reference screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs select-none">
            {/* Entries Count Text */}
            <div className="text-gray-500 font-medium">
              Showing <span className="font-semibold text-gray-700">{totalEntries > 0 ? startIndex + 1 : 0}</span> to{' '}
              <span className="font-semibold text-gray-700">{endIndex}</span> of{' '}
              <span className="font-semibold text-gray-700">{totalEntries}</span> entries
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3">
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

              <span className="text-gray-700 font-semibold px-1">
                {safeCurrentPage} <span className="text-gray-400 font-normal">/</span> {totalPages}
              </span>

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

              <div className="flex items-center gap-1.5 ml-2 text-gray-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
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

      {/* Delete Confirmation Modal */}
      {deletePlanId && (
        <ModalPortal isOpen={!!deletePlanId} onClose={() => setDeletePlanId(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-gray-900">Delete Production Plan?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this schedule period? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletePlanId(null)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-[#F04438] hover:bg-[#D92D20] text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Upload Data Modal */}
      {showUploadModal && (
        <ModalPortal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Production Schedule</h3>
                <p className="text-xs text-gray-400 mt-0.5">This field is for desc terms of service</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-gray-50/50">
                <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Click to upload or drag and drop</p>
                <p className="text-[11px] text-gray-400 mt-0.5">XLSX, XLS or CSV (max. 10MB)</p>
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Import Data
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* Toast Feedback */}
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
