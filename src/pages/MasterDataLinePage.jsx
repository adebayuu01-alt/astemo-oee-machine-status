import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import Toast from '../components/Toast';
import { INITIAL_LINES } from '../data/mockData';

export default function MasterDataLinePage() {
  const [lines, setLines] = useState(INITIAL_LINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [lineName, setLineName] = useState('');
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredLines = lines.filter((l) =>
    l.line.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredLines.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedLines = filteredLines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingLine(null);
    setLineName('');
    setShowModal(true);
  };

  const handleOpenEdit = (l) => {
    setEditingLine(l);
    setLineName(l.line);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!lineName.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Line name is required.' });
      return;
    }

    if (editingLine) {
      setLines(
        lines.map((l) =>
          l.id === editingLine.id ? { ...l, line: lineName } : l
        )
      );
      setToast({
        type: 'success',
        title: 'Line Updated',
        message: `Line ${lineName} updated successfully.`
      });
    } else {
      const newLine = {
        id: Date.now(),
        line: lineName,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      setLines([newLine, ...lines]);
      setToast({
        type: 'success',
        title: 'Line Added',
        message: `Line ${lineName} created successfully.`
      });
    }
    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    setLines(lines.filter((l) => l.id !== deleteId));
    setDeleteId(null);
    setToast({
      type: 'success',
      title: 'Deleted',
      message: 'Line deleted successfully.'
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Header Card matching Figma exact Header */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Line</h1>
            <p className="text-xs text-gray-500 mt-0.5">List line data</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search line..."
                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <AntDateRangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Data</span>
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-4">
          <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                <tr className="text-[#23262B] font-semibold">
                  <th className="py-3 px-4 w-16">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>No</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Line</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 w-48">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Datetime</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] bg-white">
                {paginatedLines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No line data found.
                    </td>
                  </tr>
                ) : (
                  paginatedLines.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-600">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        {item.line}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono">
                        {item.datetime}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Line"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Line"
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

          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-700">1</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 h-6 flex items-center justify-center border border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-xs">
                  {currentPage}
                </span>
                <span>/ {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-700 text-xs focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <ModalPortal>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1E232F]">
                {editingLine ? 'Master Data - Edit Line' : 'Master Data - Add Line'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Line Name</label>
                <input
                  type="text"
                  value={lineName}
                  onChange={(e) => setLineName(e.target.value)}
                  placeholder="e.g. Line 1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg font-semibold shadow-sm"
                >
                  {editingLine ? 'Save Changes' : 'Add Line'}
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ModalPortal>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#1E232F]">Delete Line?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this line from master data? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 bg-[#F04438] hover:bg-[#D92D20] text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

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
