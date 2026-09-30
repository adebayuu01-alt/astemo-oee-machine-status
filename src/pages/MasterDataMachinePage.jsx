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
import { INITIAL_MACHINES } from '../data/mockData';

export default function MasterDataMachinePage() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [machineName, setMachineName] = useState('');
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredMachines = machines.filter((m) =>
    m.machine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredMachines.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedMachines = filteredMachines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingMachine(null);
    setMachineName('');
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMachine(m);
    setMachineName(m.machine);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!machineName.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Machine name is required.' });
      return;
    }

    if (editingMachine) {
      setMachines(
        machines.map((m) =>
          m.id === editingMachine.id ? { ...m, machine: machineName } : m
        )
      );
      setToast({
        type: 'success',
        title: 'Machine Updated',
        message: `Machine ${machineName} updated successfully.`
      });
    } else {
      const newMachine = {
        id: Date.now(),
        machine: machineName,
        code: `CNC-${String(machines.length + 1).padStart(2, '0')}`,
        status: 'Running',
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      setMachines([newMachine, ...machines]);
      setToast({
        type: 'success',
        title: 'Machine Added',
        message: `Machine ${machineName} created successfully.`
      });
    }
    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    setMachines(machines.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    setToast({
      type: 'success',
      title: 'Deleted',
      message: 'Machine deleted successfully.'
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Header Card matching Figma exact Header */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Machine</h1>
            <p className="text-xs text-gray-500 mt-0.5">List machine data</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machine..."
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
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Machine</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Datetime</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedMachines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No machine data found.
                    </td>
                  </tr>
                ) : (
                  paginatedMachines.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1E232F]">
                        {m.machine}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {m.datetime}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(m.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
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

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-500">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 font-semibold text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Machine Modal */}
      {showModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingMachine ? 'Edit Machine' : 'Add Machine'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    This field is for desc terms of service
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Machine
                  </label>
                  <input
                    type="text"
                    value={machineName}
                    onChange={(e) => setMachineName(e.target.value)}
                    placeholder="FANUC 1"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-medium text-gray-800 placeholder-gray-400"
                    autoFocus
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Enter machine name (e.g. FANUC 1)
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Delete Machine</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to delete this machine? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Toast Notification */}
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
