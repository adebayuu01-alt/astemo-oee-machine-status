import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Cpu
} from 'lucide-react';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
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
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [currentMachineSelect, setCurrentMachineSelect] = useState('');
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
    setSelectedLine(INITIAL_LINES[0]?.line || 'Line 1');
    setSelectedMachines([INITIAL_MACHINES[0]?.machine || 'FANUC 1']);
    setCurrentMachineSelect('');
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRegister(r);
    setSelectedLine(r.line);
    setSelectedMachines([...r.machines]);
    setCurrentMachineSelect('');
    setShowModal(true);
  };

  const handleAddMachine = () => {
    if (currentMachineSelect && !selectedMachines.includes(currentMachineSelect)) {
      setSelectedMachines([...selectedMachines, currentMachineSelect]);
      setCurrentMachineSelect('');
    }
  };

  const handleRemoveMachine = (machineToRemove) => {
    setSelectedMachines(selectedMachines.filter((m) => m !== machineToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedLine) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a line.' });
      return;
    }
    if (selectedMachines.length === 0) {
      setToast({ type: 'error', title: 'Error', message: 'Please select at least one machine.' });
      return;
    }

    if (editingRegister) {
      setRegisters(
        registers.map((r) =>
          r.id === editingRegister.id
            ? { ...r, line: selectedLine, machines: selectedMachines }
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
        machines: selectedMachines,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      setRegisters([newRegister, ...registers]);
      setToast({
        type: 'success',
        title: 'Line Registered',
        message: `${selectedLine} registered with ${selectedMachines.length} machines.`
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
        {/* Top Header Card matching Figma exact Header */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Line</h1>
            <p className="text-xs text-gray-500 mt-0.5">List Line data</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search line or machine..."
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
                  <th className="py-3 px-4 w-44">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Line</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Machine</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 w-48">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <span>Datetime</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRegisters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No registration data found.
                    </td>
                  </tr>
                ) : (
                  paginatedRegisters.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600 align-top">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1E232F] align-top">
                        {r.line}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 align-top">
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
                      <td className="py-3.5 px-4 text-gray-500 align-top">
                        {r.datetime}
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(r.id)}
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

      {/* Add / Edit Register Line Modal */}
      {showModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
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
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Line Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Line
                  </label>
                  <select
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-medium text-gray-800"
                  >
                    {INITIAL_LINES.map((l) => (
                      <option key={l.id} value={l.line}>
                        {l.line}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Select target production line
                  </p>
                </div>

                {/* Machine Assignment */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Machine
                    </label>
                    <span className="text-[11px] text-gray-400">
                      We’ll never share your details. See our Privacy Policy.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <select
                      value={currentMachineSelect}
                      onChange={(e) => setCurrentMachineSelect(e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-medium text-gray-800"
                    >
                      <option value="">Select Machine to Add</option>
                      {INITIAL_MACHINES.filter(
                        (m) => !selectedMachines.includes(m.machine)
                      ).map((m) => (
                        <option key={m.id} value={m.machine}>
                          {m.machine} ({m.model})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddMachine}
                      disabled={!currentMachineSelect}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add More
                    </button>
                  </div>

                  {/* Selected Machines Tags */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 min-h-[90px] space-y-2">
                    <p className="text-[11px] font-semibold text-gray-500">
                      Assigned Machines ({selectedMachines.length}):
                    </p>
                    {selectedMachines.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No machines assigned yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedMachines.map((m) => (
                          <span
                            key={m}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#00A854]/30 rounded-md text-xs font-semibold text-[#00A854] shadow-xs"
                          >
                            <Cpu className="w-3 h-3 text-[#00A854]" />
                            {m}
                            <button
                              type="button"
                              onClick={() => handleRemoveMachine(m)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Assign one or more CNC machines to this line
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
                <h3 className="text-base font-bold text-gray-900">Delete Line Registration</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to delete this line registration? This action cannot be undone.
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
