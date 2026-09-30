import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Clock
} from 'lucide-react';
import dayjs from 'dayjs';
import AntDateRangePicker from './AntDateRangePicker';
import CustomDropdown from './CustomDropdown';

const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DEFAULT_SHIFTS = ['Shift 1', 'Shift 2', 'Shift 3'];

const MODEL_OPTIONS = [
  'HK1A1-011-01-01',
  'HK1A1-011-01-01-EXP-PHPH',
  'S4271-011-01-IN',
  'HK1A1-011-02-EXP',
  'S4271-011-02-OUT'
];

export default function PlanningProductionForm({ initialData, onSave, onCancel }) {
  // Period Date Range
  const [dateRange, setDateRange] = useState([
    dayjs('2026-09-07'),
    dayjs('2026-09-11')
  ]);

  // Days Tabs
  const [days, setDays] = useState(['Senin']);
  const [activeDay, setActiveDay] = useState('Senin');

  // Days Data configuration
  const createDefaultShiftModels = () => ({
    'Shift 1': [
      { id: 1, model: '', qty: 0, startTime: '', endTime: '', collapsed: false }
    ],
    'Shift 2': [
      { id: 1, model: '', qty: 0, startTime: '', endTime: '', collapsed: false }
    ],
    'Shift 3': [
      { id: 1, model: '', qty: 0, startTime: '', endTime: '', collapsed: false }
    ]
  });

  const [daysData, setDaysData] = useState(() => {
    if (initialData) {
      return {
        'Senin': {
          activeShift: 'Shift 1',
          shifts: ['Shift 1', 'Shift 2', 'Shift 3'],
          shiftModels: {
            'Shift 1': (initialData.shift1Items || []).map((it, idx) => ({
              id: idx + 1,
              model: it.part || '',
              qty: parseInt(it.qty, 10) || 100,
              startTime: '08:00',
              endTime: '16:00',
              collapsed: false
            })),
            'Shift 2': (initialData.shift2Items || []).map((it, idx) => ({
              id: idx + 1,
              model: it.part || '',
              qty: parseInt(it.qty, 10) || 200,
              startTime: '16:00',
              endTime: '24:00',
              collapsed: false
            })),
            'Shift 3': (initialData.shift3Items || []).map((it, idx) => ({
              id: idx + 1,
              model: it.part || '',
              qty: parseInt(it.qty, 10) || 500,
              startTime: '24:00',
              endTime: '08:00',
              collapsed: false
            }))
          }
        }
      };
    }
    return {
      'Senin': {
        activeShift: 'Shift 1',
        shifts: DEFAULT_SHIFTS,
        shiftModels: createDefaultShiftModels()
      }
    };
  });

  // Active configuration for current day
  const currentDayConfig = daysData[activeDay] || {
    activeShift: 'Shift 1',
    shifts: DEFAULT_SHIFTS,
    shiftModels: createDefaultShiftModels()
  };

  const activeShift = currentDayConfig.activeShift || 'Shift 1';
  const currentModels = (currentDayConfig.shiftModels && currentDayConfig.shiftModels[activeShift]) || [
    { id: 1, model: '', qty: 0, startTime: '', endTime: '', collapsed: false }
  ];

  // Day Handlers
  const handleAddDay = () => {
    const nextDay = ALL_DAYS.find((d) => !days.includes(d)) || `Hari ${days.length + 1}`;
    setDays((prev) => [...prev, nextDay]);
    setDaysData((prev) => ({
      ...prev,
      [nextDay]: {
        activeShift: 'Shift 1',
        shifts: [...DEFAULT_SHIFTS],
        shiftModels: createDefaultShiftModels()
      }
    }));
    setActiveDay(nextDay);
  };

  const handleRemoveDay = (dayToRemove, e) => {
    e.stopPropagation();
    if (days.length <= 1) return;
    const newDays = days.filter((d) => d !== dayToRemove);
    setDays(newDays);
    if (activeDay === dayToRemove) {
      setActiveDay(newDays[0]);
    }
  };

  // Shift Handlers
  const handleAddShift = () => {
    const nextShiftNum = currentDayConfig.shifts.length + 1;
    const nextShiftName = `Shift ${nextShiftNum}`;
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shifts: [...currentDayConfig.shifts, nextShiftName],
        shiftModels: {
          ...currentDayConfig.shiftModels,
          [nextShiftName]: [{ id: 1, model: '', qty: 0, startTime: '', endTime: '', collapsed: false }]
        },
        activeShift: nextShiftName
      }
    }));
  };

  const handleSelectShift = (shiftName) => {
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        activeShift: shiftName
      }
    }));
  };

  const handleRemoveShift = (shiftToRemove, e) => {
    e.stopPropagation();
    if (currentDayConfig.shifts.length <= 1) return;
    const newShifts = currentDayConfig.shifts.filter((s) => s !== shiftToRemove);
    const newActive = currentDayConfig.activeShift === shiftToRemove ? newShifts[0] : currentDayConfig.activeShift;
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shifts: newShifts,
        activeShift: newActive
      }
    }));
  };

  // Model Handlers
  const handleAddModel = () => {
    const newModel = {
      id: Date.now() + Math.random(),
      model: '',
      qty: 0,
      startTime: '',
      endTime: '',
      collapsed: false
    };
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shiftModels: {
          ...currentDayConfig.shiftModels,
          [activeShift]: [...currentModels, newModel]
        }
      }
    }));
  };

  const handleRemoveModel = (modelId) => {
    if (currentModels.length <= 1) {
      // Reset single model instead of completely deleting
      setDaysData((prev) => ({
        ...prev,
        [activeDay]: {
          ...currentDayConfig,
          shiftModels: {
            ...currentDayConfig.shiftModels,
            [activeShift]: [{ id: Date.now(), model: '', qty: 0, startTime: '', endTime: '', collapsed: false }]
          }
        }
      }));
      return;
    }
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shiftModels: {
          ...currentDayConfig.shiftModels,
          [activeShift]: currentModels.filter((m) => m.id !== modelId)
        }
      }
    }));
  };

  const handleToggleCollapse = (modelId) => {
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shiftModels: {
          ...currentDayConfig.shiftModels,
          [activeShift]: currentModels.map((m) =>
            m.id === modelId ? { ...m, collapsed: !m.collapsed } : m
          )
        }
      }
    }));
  };

  const handleUpdateModelField = (modelId, field, val) => {
    setDaysData((prev) => ({
      ...prev,
      [activeDay]: {
        ...currentDayConfig,
        shiftModels: {
          ...currentDayConfig.shiftModels,
          [activeShift]: currentModels.map((m) =>
            m.id === modelId ? { ...m, [field]: val } : m
          )
        }
      }
    }));
  };

  // Save Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const periodStr = dateRange && dateRange[0] && dateRange[1]
      ? `${dateRange[0].format('DD MMMM YYYY')} - ${dateRange[1].format('DD MMMM YYYY')}`
      : '07 September - 11 September 2026';

    const s1 = (currentDayConfig.shiftModels['Shift 1'] || []).filter((m) => m.model).map((m) => ({
      part: m.model,
      qty: `${m.qty || 100}pcs`
    }));
    const s2 = (currentDayConfig.shiftModels['Shift 2'] || []).filter((m) => m.model).map((m) => ({
      part: m.model,
      qty: `${m.qty || 200}pcs`
    }));
    const s3 = (currentDayConfig.shiftModels['Shift 3'] || []).filter((m) => m.model).map((m) => ({
      part: m.model,
      qty: `${m.qty || 500}pcs`
    }));

    const planPayload = {
      id: initialData ? initialData.id : Date.now(),
      period: periodStr,
      shift1Items: s1.length > 0 ? s1 : [
        { part: 'HK1A1-011-01-01', qty: '100pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
        { part: 'S4271-011-01-IN', qty: '500pcs' }
      ],
      shift2Items: s2.length > 0 ? s2 : [
        { part: 'HK1A1-011-01-01', qty: '100pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
        { part: 'S4271-011-01-IN', qty: '500pcs' }
      ],
      shift3Items: s3.length > 0 ? s3 : [
        { part: 'HK1A1-011-01-01', qty: '100pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
        { part: 'S4271-011-01-IN', qty: '500pcs' }
      ],
      datetime: dayjs().format('DD/MM/YYYY HH:mm')
    };

    onSave(planPayload);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header Card matching Alarm History style with Breadcrumb */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1E232F]">
            {initialData ? 'Edit Data Planning' : 'Add Data Planning'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Data table information
          </p>
        </div>

        {/* Breadcrumb matching history alarm */}
        <div className="flex items-center text-xs font-medium select-none">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-[#00A854] transition-colors cursor-pointer"
          >
            Planning Production
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1.5 flex-shrink-0" />
          <span className="text-[#00A854] font-semibold">
            {initialData ? 'Edit Data Planning' : 'Add Data Planning'}
          </span>
        </div>
      </div>

      {/* Main Content Card matching screenshot */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-sm space-y-5">
        {/* Period Row */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">Period</label>
          <AntDateRangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD MMMM YYYY"
            placeholder={['07 September 2026', '11 September 2026']}
            className="w-full"
            style={{ width: '100%', height: '40px' }}
          />
        </div>

        {/* Day Tabs and Outer Day Container Group */}
        <div className="relative">
          {/* Day Tabs matching screenshot */}
          <div className="flex items-end -mb-px relative z-10 select-none">
            {days.map((d, index) => {
              const isActive = d === activeDay;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDay(d)}
                  className={`h-10 px-4 rounded-t-xl text-[13px] flex items-center gap-3 transition-colors cursor-pointer relative ${
                    index > 0 ? '-ml-px' : ''
                  } ${
                    isActive
                      ? 'border border-[#2E90FA] border-b-[#EFF8FF] bg-[#EFF8FF] text-[#2E90FA] font-semibold z-20'
                      : 'border border-[#D0D5DD] bg-white text-[#344054] font-medium hover:bg-gray-50 z-10'
                  }`}
                >
                  <span>{d}</span>
                  <span
                    onClick={(e) => handleRemoveDay(d, e)}
                    className={`p-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'text-[#2E90FA] hover:bg-blue-100/60'
                        : 'text-[#475467] hover:bg-gray-100'
                    }`}
                    title="Remove Day"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2.2} />
                  </span>
                </button>
              );
            })}

            {/* Add Day Button (+) */}
            <button
              type="button"
              onClick={handleAddDay}
              className="h-10 px-3.5 -ml-px rounded-t-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#98A2B3] hover:text-[#344054] flex items-center justify-center cursor-pointer transition-colors relative z-10"
              title="Add Day"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Day Container Box matching screenshot */}
          <div className="border border-[#D0D5DD] rounded-tr-xl rounded-b-xl rounded-tl-none p-5 bg-white relative z-0">
            {/* Shift Tabs and Inner Box Group */}
            <div className="relative">
              {/* Shift Tabs matching screenshot */}
              <div className="flex items-end -mb-px relative z-10 select-none">
                {currentDayConfig.shifts.map((s, index) => {
                  const isActive = s === activeShift;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectShift(s)}
                      className={`h-10 px-4 rounded-t-xl text-[13px] flex items-center gap-3 transition-colors cursor-pointer relative ${
                        index > 0 ? '-ml-px' : ''
                      } ${
                        isActive
                          ? 'border border-[#00A854] border-b-[#ECFDF3] bg-[#ECFDF3] text-[#00A854] font-semibold z-20'
                          : 'border border-[#D0D5DD] bg-white text-[#344054] font-medium hover:bg-gray-50 z-10'
                      }`}
                    >
                      <span>{s}</span>
                      <span
                        onClick={(e) => handleRemoveShift(s, e)}
                        className={`p-0.5 rounded-full transition-colors ${
                          isActive
                            ? 'text-[#00A854] hover:bg-green-100/60'
                            : 'text-[#475467] hover:bg-gray-100'
                        }`}
                        title="Remove Shift"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </span>
                    </button>
                  );
                })}

                {/* Add Shift Button (+) */}
                <button
                  type="button"
                  onClick={handleAddShift}
                  className="h-10 px-3.5 -ml-px rounded-t-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#98A2B3] hover:text-[#344054] flex items-center justify-center cursor-pointer transition-colors relative z-10"
                  title="Add Shift"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* Inner Box Container matching screenshot */}
              <div className="border border-[#D0D5DD] rounded-tr-xl rounded-b-xl rounded-tl-none p-5 space-y-4 bg-white relative z-0">
                {/* Header: Add Planning Production + Green Plus Button */}
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-sm font-bold text-[#1E232F]">Add Planning Production</h3>
                  <button
                    type="button"
                    onClick={handleAddModel}
                    className="w-7 h-7 rounded-lg bg-[#00A854] hover:bg-[#008C45] text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                    title="Add Model"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

            {/* Models Accordion List matching screenshot */}
            <div className="space-y-4">
              {currentModels.map((m, idx) => (
                <div
                  key={m.id}
                  className="border border-[#EAECF0] rounded-xl p-4 bg-white shadow-2xs space-y-3"
                >
                  {/* Model Header */}
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => handleToggleCollapse(m.id)}
                      className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#1E232F] hover:text-[#00A854] transition-colors"
                    >
                      {m.collapsed ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      )}
                      <span>Model {idx + 1}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveModel(m.id)}
                      className="w-7 h-7 rounded-lg border border-[#FDA29B] text-[#F04438] hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer bg-white shadow-2xs"
                      title="Delete Model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Model Form Fields (Collapsible) */}
                  {!m.collapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                      {/* Model Dropdown */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Model</label>
                        <CustomDropdown
                          value={m.model}
                          onChange={(val) => handleUpdateModelField(m.id, 'model', val)}
                          options={MODEL_OPTIONS}
                          placeholder="Select Model"
                          className="w-full"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={m.qty === 0 ? '' : m.qty}
                          onChange={(e) =>
                            handleUpdateModelField(m.id, 'qty', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-full h-[38px] px-3 bg-white border border-[#D0D5DD] rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#00A854] transition-colors"
                        />
                      </div>

                      {/* Start Time */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Start Time</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={m.startTime}
                            onChange={(e) => handleUpdateModelField(m.id, 'startTime', e.target.value)}
                            placeholder="--:--"
                            className="w-full h-[38px] pl-3 pr-8 bg-white border border-[#D0D5DD] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854] transition-colors"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* End Time */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">End Time</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={m.endTime}
                            onChange={(e) => handleUpdateModelField(m.id, 'endTime', e.target.value)}
                            placeholder="--:--"
                            className="w-full h-[38px] pl-3 pr-8 bg-white border border-[#D0D5DD] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854] transition-colors"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

      {/* Footer Action Card matching screenshot */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex items-center justify-end gap-3 shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-6 border border-[#D0D5DD] bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="h-10 px-6 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
