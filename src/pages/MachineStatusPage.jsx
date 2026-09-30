import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  History,
  Search,
  X,
  Calendar,
  RotateCcw,
  CircleMinus,
  CirclePlus
} from 'lucide-react';
import dayjs from 'dayjs';
import AntDateRangePicker from '../components/AntDateRangePicker';
import CustomDropdown from '../components/CustomDropdown';
import AlarmHistoryPage from './AlarmHistoryPage';

const SHIFT_OPTIONS = ['Shift 1', 'Shift 2', 'Shift 3'];

// Shift configurations with default time boundaries and ticks
const SHIFT_CONFIG = {
  'Shift 1': {
    startH: 7,
    startM: 35,
    endH: 16,
    endM: 0,
    ticks: [
      { label: '07:35', left: '0%' },
      { label: '09:00', left: '16.8%' },
      { label: '10:00', left: '28.7%' },
      { label: '11:00', left: '40.6%' },
      { label: '12:00', left: '52.5%' },
      { label: '13:00', left: '64.4%' },
      { label: '14:00', left: '76.2%' },
      { label: '15:00', left: '88.1%' },
      { label: '16:00', left: '100%' }
    ]
  },
  'Shift 2': {
    startH: 16,
    startM: 0,
    endH: 23,
    endM: 59,
    ticks: [
      { label: '16:00', left: '0%' },
      { label: '17:00', left: '12.5%' },
      { label: '18:00', left: '25.0%' },
      { label: '19:00', left: '37.5%' },
      { label: '20:00', left: '50.0%' },
      { label: '21:00', left: '62.5%' },
      { label: '22:00', left: '75.0%' },
      { label: '23:00', left: '87.5%' },
      { label: '00:00', left: '100%' }
    ]
  },
  'Shift 3': {
    startH: 0,
    startM: 0,
    endH: 7,
    endM: 35,
    ticks: [
      { label: '00:00', left: '0%' },
      { label: '01:00', left: '13.2%' },
      { label: '02:00', left: '26.4%' },
      { label: '03:00', left: '39.6%' },
      { label: '04:00', left: '52.7%' },
      { label: '05:00', left: '65.9%' },
      { label: '06:00', left: '79.1%' },
      { label: '07:00', left: '92.3%' },
      { label: '07:35', left: '100%' }
    ]
  }
};

// Original baseline timeline segments matching the user screenshot for Shift 1
const TIMELINE_SEGMENTS_F1 = [
  { status: 'Stop', width: '1.2%', label: 'Stop', time: '07:35 - 07:41' },
  { status: 'Running', width: '17.5%', label: 'Running', time: '07:41 - 08:48' },
  { status: 'Stop', width: '1.2%', label: 'Stop', time: '08:48 - 08:54' },
  { status: 'Running', width: '14.5%', label: 'Running', time: '08:54 - 09:42' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '09:42 - 09:50' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '09:50 - 09:54' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '09:54 - 10:02' },
  { status: 'Running', width: '13.8%', label: 'Running', time: '10:02 - 10:48' },
  { status: 'Stop', width: '1.4%', label: 'Stop', time: '10:48 - 10:55' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '10:55 - 10:59' },
  { status: 'Stop', width: '1.4%', label: 'Stop', time: '10:59 - 11:06' },
  { status: 'Running', width: '18.2%', label: 'Running', time: '11:06 - 11:56' },
  { status: 'Stop', width: '1.8%', label: 'Stop', time: '11:56 - 12:05' },
  { status: 'Running', width: '19.2%', label: 'Running', time: '12:05 - 13:01' },
  { status: 'Stop', width: '1.5%', label: 'Stop', time: '13:01 - 13:08' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '13:08 - 13:12' },
  { status: 'Stop', width: '1.5%', label: 'Stop', time: '13:12 - 13:19' },
  { status: 'Running', width: '18.4%', label: 'Running', time: '13:19 - 14:18' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '14:18 - 14:26' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '14:26 - 14:30' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '14:30 - 14:38' },
  { status: 'Running', width: '18.5%', label: 'Running', time: '14:38 - 15:24' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '15:24 - 15:32' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '15:32 - 15:36' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '15:36 - 15:44' },
  { status: 'Running', width: '8.5%', label: 'Running', time: '15:44 - 15:54' },
  { status: 'Stop', width: '1.6%', label: 'Stop', time: '15:54 - 15:58' },
  { status: 'Running', width: '0.8%', label: 'Running', time: '15:58 - 16:00' },
  { status: 'Stop', width: '1.2%', label: 'Stop', time: '16:00' }
];

const BASE_MACHINES = [
  { id: 1, name: 'Fannuc 1' },
  { id: 2, name: 'Fannuc 2' },
  { id: 3, name: 'Fannuc 3' },
  { id: 4, name: 'Fannuc 4' },
  { id: 5, name: 'Fannuc 5' }
];

const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5];

// Helper to generate dynamic time ticks depending on shift, date range, and zoom factor
function getTimelineTicks(selectedShift, dateRange, zoom = 1) {
  if (dateRange && dateRange[0] && dateRange[1]) {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const totalMinutes = Math.max(endDate.diff(startDate, 'minute'), 15);
    const isMultiDay = !startDate.isSame(endDate, 'day') || totalMinutes > 1440;
    const timeFormat = isMultiDay ? 'DD/MM HH:mm' : 'HH:mm';

    let baseCount = 8;
    if (totalMinutes <= 60) baseCount = 4;
    else if (totalMinutes <= 180) baseCount = 5;
    else if (totalMinutes <= 480) baseCount = 7;

    const tickCount = Math.min(Math.round(baseCount * Math.sqrt(zoom)), 36);
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const fraction = i / tickCount;
      const tickTime = startDate.add(Math.round(fraction * totalMinutes), 'minute');
      ticks.push({
        label: tickTime.format(timeFormat),
        left: `${(fraction * 100).toFixed(1)}%`
      });
    }
    return ticks;
  }

  const cfg = SHIFT_CONFIG[selectedShift] || SHIFT_CONFIG['Shift 1'];
  if (zoom <= 1) {
    return cfg.ticks;
  }

  // When zoomed in, calculate granular ticks across the shift
  const startTotal = cfg.startH * 60 + cfg.startM;
  let endTotal = cfg.endH * 60 + cfg.endM;
  if (endTotal <= startTotal) {
    endTotal += 24 * 60;
  }
  const totalMinutes = endTotal - startTotal;

  let stepMinutes = 30;
  if (zoom >= 4) stepMinutes = 10;
  else if (zoom >= 2.5) stepMinutes = 15;
  else stepMinutes = 30;

  const ticks = [];
  // Start tick
  ticks.push({
    label: `${String(cfg.startH).padStart(2, '0')}:${String(cfg.startM).padStart(2, '0')}`,
    left: '0%'
  });

  const firstStep = Math.ceil(startTotal / stepMinutes) * stepMinutes;
  for (let m = firstStep; m < endTotal; m += stepMinutes) {
    if (m === startTotal) continue;
    const minOfDay = m % (24 * 60);
    const h = Math.floor(minOfDay / 60);
    const min = minOfDay % 60;
    const fraction = (m - startTotal) / totalMinutes;
    ticks.push({
      label: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      left: `${(fraction * 100).toFixed(2)}%`
    });
  }

  // End tick
  const endH = cfg.endH % 24;
  ticks.push({
    label: `${String(endH).padStart(2, '0')}:${String(cfg.endM).padStart(2, '0')}`,
    left: '100%'
  });

  return ticks;
}

// Helper to generate realistic dummy timeline segments based on date range and machineId
function generateDummyTimeline(startDate, endDate, machineId) {
  const totalMinutes = Math.max(endDate.diff(startDate, 'minute'), 15);
  const isMultiDay = !startDate.isSame(endDate, 'day') || totalMinutes > 1440;
  const timeFormat = isMultiDay ? 'DD/MM HH:mm' : 'HH:mm';

  // Deterministic seed based on timestamps and machine ID
  let seed = Math.abs(
    (startDate.unix() % 100000) * 19 +
    (endDate.unix() % 100000) * 23 +
    machineId * 53
  );
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const segments = [];
  let currentMinute = 0;
  let isRunning = rand() > 0.2; // 80% start running

  while (currentMinute < totalMinutes) {
    let segMinutes;
    if (isRunning) {
      const maxRun = Math.min(100, Math.max(15, totalMinutes * 0.35));
      const minRun = Math.min(20, Math.max(5, totalMinutes * 0.08));
      segMinutes = Math.round(minRun + rand() * (maxRun - minRun));
    } else {
      const maxStop = Math.min(20, Math.max(5, totalMinutes * 0.08));
      const minStop = Math.min(4, Math.max(2, totalMinutes * 0.02));
      segMinutes = Math.round(minStop + rand() * (maxStop - minStop));
    }

    if (currentMinute + segMinutes > totalMinutes) {
      segMinutes = totalMinutes - currentMinute;
    }

    const segStart = startDate.add(currentMinute, 'minute');
    const segEnd = startDate.add(currentMinute + segMinutes, 'minute');
    const widthPct = ((segMinutes / totalMinutes) * 100).toFixed(2);

    segments.push({
      status: isRunning ? 'Running' : 'Stop',
      label: isRunning ? 'Running' : 'Stop',
      width: `${widthPct}%`,
      time: `${segStart.format(timeFormat)} - ${segEnd.format(timeFormat)}`
    });

    currentMinute += segMinutes;
    isRunning = !isRunning;
  }

  return segments;
}

export default function MachineStatusPage({ onNavigateAlarmHistory }) {
  const [currentView, setCurrentView] = useState('status'); // 'status' | 'alarm-history'
  const [selectedShift, setSelectedShift] = useState('Shift 1');
  const [dateRange, setDateRange] = useState(null);

  const handleOpenAlarmHistory = () => {
    if (onNavigateAlarmHistory) {
      onNavigateAlarmHistory();
    } else {
      setCurrentView('alarm-history');
    }
  };

  // Zoom level state per machine (machineId -> zoom level, default 1)
  const [zoomLevels, setZoomLevels] = useState({});

  // Refs for scrollable timeline containers per machine
  const scrollContainerRefs = useRef({});

  // Drag-to-scroll state
  const [dragState, setDragState] = useState({
    isDragging: false,
    machineId: null,
    startX: 0,
    scrollLeft: 0
  });

  // Floating cursor tooltip state (positions tooltip to the right of cursor)
  const [cursorTooltip, setCursorTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });

  const handleSegmentMouseMove = (e, seg) => {
    if (dragState.isDragging) {
      if (cursorTooltip.visible) {
        setCursorTooltip((prev) => ({ ...prev, visible: false }));
      }
      return;
    }
    setCursorTooltip({
      visible: true,
      x: e.clientX + 16,
      y: e.clientY,
      data: seg
    });
  };

  const handleSegmentMouseLeave = () => {
    setCursorTooltip({
      visible: false,
      x: 0,
      y: 0,
      data: null
    });
  };

  // Global mouseup listener for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragState((prev) => {
        if (prev.isDragging) {
          return { ...prev, isDragging: false, machineId: null };
        }
        return prev;
      });
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getZoom = useCallback((machineId) => {
    return zoomLevels[machineId] || 1;
  }, [zoomLevels]);

  const handleZoomIn = (machineId) => {
    const currentZ = getZoom(machineId);
    const nextZ = ZOOM_LEVELS.find((z) => z > currentZ) || ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    if (nextZ === currentZ) return;

    const container = scrollContainerRefs.current[machineId];
    if (container) {
      const centerRatio = (container.scrollLeft + container.clientWidth / 2) / (container.scrollWidth || 1);
      setZoomLevels((prev) => ({ ...prev, [machineId]: nextZ }));
      requestAnimationFrame(() => {
        if (container) {
          container.scrollLeft = centerRatio * container.scrollWidth - container.clientWidth / 2;
        }
      });
    } else {
      setZoomLevels((prev) => ({ ...prev, [machineId]: nextZ }));
    }
  };

  const handleZoomOut = (machineId) => {
    const currentZ = getZoom(machineId);
    const reversed = [...ZOOM_LEVELS].reverse();
    const nextZ = reversed.find((z) => z < currentZ) || 1;
    if (nextZ === currentZ) return;

    const container = scrollContainerRefs.current[machineId];
    if (container) {
      const centerRatio = (container.scrollLeft + container.clientWidth / 2) / (container.scrollWidth || 1);
      setZoomLevels((prev) => ({ ...prev, [machineId]: nextZ }));
      requestAnimationFrame(() => {
        if (container) {
          container.scrollLeft = centerRatio * container.scrollWidth - container.clientWidth / 2;
        }
      });
    } else {
      setZoomLevels((prev) => ({ ...prev, [machineId]: nextZ }));
    }
  };

  const handleResetZoom = (machineId) => {
    setZoomLevels((prev) => ({ ...prev, [machineId]: 1 }));
    const container = scrollContainerRefs.current[machineId];
    if (container) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e, machineId) => {
    if (e.button !== 0) return; // Only left click
    const currentZ = getZoom(machineId);
    if (currentZ <= 1) return;

    const container = scrollContainerRefs.current[machineId];
    if (!container) return;

    setDragState({
      isDragging: true,
      machineId,
      startX: e.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft
    });
  };

  const handleMouseMove = (e, machineId) => {
    if (!dragState.isDragging || dragState.machineId !== machineId) return;
    e.preventDefault();
    const container = scrollContainerRefs.current[machineId];
    if (!container) return;

    const currentX = e.pageX - container.offsetLeft;
    const walk = (currentX - dragState.startX) * 1.5;
    container.scrollLeft = dragState.scrollLeft - walk;
  };

  const handleWheel = (e, machineId) => {
    const currentZ = getZoom(machineId);
    if (currentZ <= 1) return;
    const container = scrollContainerRefs.current[machineId];
    if (!container) return;

    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn(machineId);
      } else {
        handleZoomOut(machineId);
      }
    } else if (e.shiftKey) {
      container.scrollLeft += e.deltaY;
    }
  };

  // Compute active machine timeline data dynamically based on dateRange or selectedShift
  const activeMachines = useMemo(() => {
    return BASE_MACHINES.map((m) => {
      // 1. If custom Date & Time range is selected by the user
      if (dateRange && dateRange[0] && dateRange[1]) {
        const segs = generateDummyTimeline(dateRange[0], dateRange[1], m.id);
        const formatStr = !dateRange[0].isSame(dateRange[1], 'day') ? 'DD/MM HH:mm' : 'HH:mm';
        return {
          id: m.id,
          name: m.name,
          subtitle: `Status of ${m.name.toLowerCase()} (${dateRange[0].format(formatStr)} - ${dateRange[1].format(formatStr)})`,
          segments: segs
        };
      }

      // 2. If Shift 1 and Machine 1, preserve the exact screenshot baseline segments
      if (selectedShift === 'Shift 1' && m.id === 1) {
        return {
          id: m.id,
          name: m.name,
          subtitle: `Status of ${m.name.toLowerCase()}`,
          segments: TIMELINE_SEGMENTS_F1
        };
      }

      // 3. For other machines or shifts, generate shift-based dummy segments
      const cfg = SHIFT_CONFIG[selectedShift] || SHIFT_CONFIG['Shift 1'];
      const today = dayjs();
      const start = today.hour(cfg.startH).minute(cfg.startM).second(0);
      const end = today.hour(cfg.endH).minute(cfg.endM).second(0);
      const segs = generateDummyTimeline(start, end, m.id);

      return {
        id: m.id,
        name: m.name,
        subtitle: `Status of ${m.name.toLowerCase()}`,
        segments: segs
      };
    });
  }, [dateRange, selectedShift]);

  if (currentView === 'alarm-history') {
    return <AlarmHistoryPage onBack={() => setCurrentView('status')} />;
  }

  return (
    <>
      <div className="space-y-5">
        {/* Top Header Card matching user screenshot exactly */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Machine Status</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Monitor the current status of machines
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Shift Select - Height 38px matching other components */}
            <div className="w-28">
              <CustomDropdown
                value={selectedShift}
                onChange={(val) => {
                  setSelectedShift(val);
                }}
                options={SHIFT_OPTIONS}
                placeholder="Shift 1"
              />
            </div>

            {/* Ant Design Date & Time Range Picker - Height 38px with Time Picker */}
            <AntDateRangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              placeholder={['Start date & time', 'End date & time']}
              className="w-[320px] sm:w-[350px]"
            />

            {/* Alarm History Button - Height 38px in green */}
            <button
              type="button"
              onClick={handleOpenAlarmHistory}
              className="h-[38px] px-4 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <History className="w-4 h-4 text-white" />
              <span>Alarm History</span>
            </button>
          </div>
        </div>

        {/* Machine Timeline Cards List matching user screenshot */}
        <div className="space-y-5">
          {activeMachines.map((m) => {
            const currentZoom = getZoom(m.id);
            const machineTicks = getTimelineTicks(selectedShift, dateRange, currentZoom);

            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-3"
              >
                {/* Header inside machine card with zoom menu */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1E232F] leading-tight">{m.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{m.subtitle}</p>
                  </div>

                  {/* Zoom Controls Toolbar matching user screenshot */}
                  <div className="flex items-center gap-3">
                    {currentZoom > 1 && (
                      <span className="text-xs font-semibold text-[#00A854] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full select-none animate-in fade-in duration-200">
                        {Math.round(currentZoom * 100)}%
                      </span>
                    )}

                    <div className="flex items-center gap-2.5">
                      {/* Reset Zoom */}
                      <button
                        type="button"
                        onClick={() => handleResetZoom(m.id)}
                        disabled={currentZoom === 1}
                        title={currentZoom === 1 ? 'Zoom normal (100%)' : 'Reset zoom (100%)'}
                        className={`transition-colors p-1 rounded-md ${
                          currentZoom === 1
                            ? 'text-[#C4C8D0] cursor-not-allowed'
                            : 'text-[#475467] hover:text-[#1E232F] hover:bg-gray-100 active:scale-90 cursor-pointer'
                        }`}
                      >
                        <RotateCcw className="w-5 h-5" strokeWidth={1.8} />
                      </button>

                      {/* Zoom Out */}
                      <button
                        type="button"
                        onClick={() => handleZoomOut(m.id)}
                        disabled={currentZoom <= 1}
                        title={currentZoom <= 1 ? 'Zoom minimum' : 'Perkecil zoom'}
                        className={`transition-colors p-1 rounded-md ${
                          currentZoom <= 1
                            ? 'text-[#C4C8D0] cursor-not-allowed'
                            : 'text-[#475467] hover:text-[#1E232F] hover:bg-gray-100 active:scale-90 cursor-pointer'
                        }`}
                      >
                        <CircleMinus className="w-5 h-5" strokeWidth={1.8} />
                      </button>

                      {/* Zoom In */}
                      <button
                        type="button"
                        onClick={() => handleZoomIn(m.id)}
                        disabled={currentZoom >= 5}
                        title={currentZoom >= 5 ? 'Zoom maksimum' : 'Perbesar zoom'}
                        className={`transition-colors p-1 rounded-md ${
                          currentZoom >= 5
                            ? 'text-[#C4C8D0] cursor-not-allowed'
                            : 'text-[#475467] hover:text-[#1E232F] hover:bg-gray-100 active:scale-90 cursor-pointer'
                        }`}
                      >
                        <CirclePlus className="w-5 h-5" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline Container with Horizontal Scroll */}
                <div className="mt-1">
                  {/* Scrollable Timeline Area */}
                  <div
                    ref={(el) => (scrollContainerRefs.current[m.id] = el)}
                    className={`chart-scrollbar overflow-x-auto pt-1 pb-2 select-none transition-all ${
                      currentZoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                    onMouseDown={(e) => handleMouseDown(e, m.id)}
                    onMouseMove={(e) => handleMouseMove(e, m.id)}
                    onWheel={(e) => handleWheel(e, m.id)}
                    onMouseLeave={handleSegmentMouseLeave}
                  >
                    <div
                      style={{
                        width: `${currentZoom * 100}%`,
                        minWidth: '100%'
                      }}
                      className="transition-[width] duration-200 ease-out"
                    >
                      {/* Continuous Timeline Bar - Taller height and compact top gap */}
                      <div className="w-full h-48 md:h-52 flex rounded-sm border border-gray-100 shadow-xs relative overflow-hidden">
                        {m.segments.map((seg, idx) => {
                          const isGreen = seg.status === 'Running';
                          const isFirst = idx === 0;
                          const isLast = idx === m.segments.length - 1;

                          return (
                            <div
                              key={idx}
                              style={{ width: seg.width }}
                              onMouseEnter={(e) => handleSegmentMouseMove(e, seg)}
                              onMouseMove={(e) => handleSegmentMouseMove(e, seg)}
                              className={`h-full relative transition-all cursor-pointer ${
                                isGreen ? 'bg-[#00A854] hover:brightness-105' : 'bg-[#F04438] hover:brightness-105'
                              } ${isFirst ? 'rounded-l-sm' : ''} ${isLast ? 'rounded-r-sm' : ''}`}
                            />
                          );
                        })}
                      </div>

                      {/* Timeline Time Ticks underneath */}
                      <div className="relative w-full h-6 text-xs text-gray-600 font-medium mt-2 select-none">
                        {machineTicks.map((t, idx) => {
                          let posClass = '-translate-x-1/2';
                          if (idx === 0) posClass = '';
                          if (idx === machineTicks.length - 1) posClass = '-translate-x-full';

                          return (
                            <div
                              key={`${t.label}-${idx}`}
                              className={`absolute top-0 flex flex-col items-center ${posClass}`}
                              style={{ left: t.left }}
                            >
                              <div className="w-[1px] h-1.5 bg-gray-300 mb-1" />
                              <span className="whitespace-nowrap text-[11px] font-medium text-gray-600">
                                {t.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Legend */}
                  <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100 select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#00A854]" />
                      <span className="text-xs font-semibold text-gray-700">Running</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F04438]" />
                      <span className="text-xs font-semibold text-gray-700">Stop</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Cursor Tooltip (positioned to the right of cursor) */}
        {cursorTooltip.visible && cursorTooltip.data && (
          <div
            className="fixed z-50 pointer-events-none select-none transition-all duration-75 ease-out"
            style={{
              left: `${
                typeof window !== 'undefined' && cursorTooltip.x > window.innerWidth - 200
                  ? cursorTooltip.x - 190
                  : cursorTooltip.x
              }px`,
              top: `${cursorTooltip.y}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="bg-[#1E232F]/95 text-white text-xs rounded-lg py-2 px-3 shadow-2xl border border-gray-700/80 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    cursorTooltip.data.status === 'Running' ? 'bg-[#00A854]' : 'bg-[#F04438]'
                  }`}
                />
                <span className="font-bold text-white text-xs">
                  {cursorTooltip.data.label}
                </span>
              </div>
              <p className="text-gray-300 text-[11px] font-medium tracking-tight">
                {cursorTooltip.data.time}
              </p>
            </div>
          </div>
        )}
      </div>

    </>
  );
}
