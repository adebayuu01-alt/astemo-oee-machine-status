import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Cpu
} from 'lucide-react';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import CustomDropdown from '../components/CustomDropdown';
import Toast from '../components/Toast';
import { INITIAL_REGISTERS, INITIAL_LINES, INITIAL_MACHINES } from '../data/mockData';

export default function RegisterLinePage() {
  const [registers, setRegisters] = useState(INITIAL_REGISTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRegister, setEditingRegister] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form states
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedMachines, setSelectedMachines] = useState(['']);
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredRegisters = registers.filter(
    (r) =>
      r.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.machines.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalEntries = filteredRegisters.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedRegisters = filteredRegisters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingRegister(null);
    setSelectedLine('');
    setSelectedMachines(['']);
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRegister(r);
    setSelectedLine(r.line);
    setSelectedMachines(r.machines && r.machines.length > 0 ? [...r.machines] : ['']);
    setShowModal(true);
  };

  const handleAddMachineRow = () => {
    setSelectedMachines([...selectedMachines, '']);
  };

  const handleMachineChange = (index, value) => {
    const updated = [...selectedMachines];
    updated[index] = value;
    setSelectedMachines(updated);
  };

  const handleRemoveMachineRow = (index) => {
    if (selectedMachines.length > 1) {
      setSelectedMachines(selectedMachines.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validMachines = selectedMachines.filter((m) => m && m.trim() !== '');
    if (!selectedLine) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a line.' });
      return;
    }
    if (validMachines.length === 0) {
      setToast({ type: 'error', title: 'Error', message: 'Please select at least one machine.' });
      return;
    }

    if (editingRegister) {
      setRegisters(
        registers.map((r) =>
          r.id === editingRegister.id
            ? { ...r, line: selectedLine, machines: validMachines }
            : r
        )
      );
      setToast({
        type: 'success',
        title: 'Line Registration Updated',
        message: `${selectedLine} registration updated successfully.`
      });
    } else {
      const newRegister = {
        id: Date.now(),
        line: selectedLine,
        machines: validMachines,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      setRegisters([newRegister, ...registers]);
      setToast({
        type: 'success',
        title: 'Line Registered',
        message: `${selectedLine} registered with ${validMachines.length} machines.`
      });
    }
    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    setRegisters(registers.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    setToast({
      type: 'success',
      title: 'Deleted',
      message: 'Registration deleted successfully.'
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex-shrink-0">
          <h1 className="text-xl font-bold text-[#1E232F]">Line</h1>
          <p className="text-xs text-gray-500 mt-0.5">List Line data</p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search line or machine..."
                className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
            <table className="w-full text-left border-collapse text-sm font-sans">
              <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                <tr className="text-[#23262B] font-semibold">
                  <th className="py-3.5 px-4 w-16">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>No</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-44">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Line</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Machine</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-48">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Datetime</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] bg-white">
                {paginatedRegisters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No registration data found.
                    </td>
                  </tr>
                ) : (
                  paginatedRegisters.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-600 align-top leading-5">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 align-top leading-5">
                        {r.line}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 align-top leading-5">
                        <div className="space-y-1">
                          {r.machines.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="font-medium text-gray-800 leading-tight"
                            >
                              {m}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 align-top leading-5">
                        {r.datetime}
                      </td>
                      <td className="py-3.5 px-4 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(r.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Add / Edit Register Line Modal matching screenshots */}
      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3 flex-shrink-0">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingRegister ? 'Edit Register Line' : 'Register Line'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* Line Select */}
            <div className="relative z-40">
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                Line
              </label>
              <CustomDropdown
                value={selectedLine}
                onChange={(val) => setSelectedLine(val)}
                options={INITIAL_LINES}
                placeholder="Select Line"
                buttonClassName="h-11 rounded-xl"
              />
            </div>

            {/* Add More Header Row */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-gray-900">Add More</span>
              <button
                type="button"
                onClick={handleAddMachineRow}
                className="w-8 h-8 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Add More Machine"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Machine Select Rows */}
            <div className="space-y-4">
              {selectedMachines.map((mach, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 relative"
                  style={{ zIndex: 30 - idx }}
                >
                  <label className="block text-sm font-bold text-gray-900">
                    Machine
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <CustomDropdown
                        value={mach}
                        onChange={(val) => handleMachineChange(idx, val)}
                        options={INITIAL_MACHINES}
                        placeholder="Select Machine"
                        buttonClassName="h-11 rounded-xl"
                      />
                    </div>

                    {/* Delete button: only shown when machines count > 1 */}
                    {selectedMachines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMachineRow(idx)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        title="Delete Machine"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons with divider */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete Confirmation Modal */}
      <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Delete Line Registration?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to delete this line registration? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalPortal>

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
