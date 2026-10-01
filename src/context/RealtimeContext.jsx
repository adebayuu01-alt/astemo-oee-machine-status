import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  SHIFT_DASHBOARD_DATA
} from '../data/mockData';

const RealtimeContext = createContext(null);

// Helper to convert HH:mm:ss to total seconds
function timeStrToSeconds(str) {
  if (!str) return 0;
  const parts = str.split(':').map((p) => parseInt(p, 10) || 0);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Helper to format seconds to HH:mm:ss
function secondsToTimeStr(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function RealtimeProvider({ children }) {
  // Global active Line and Shift selections
  const [selectedLine, setSelectedLine] = useState('Line 1');
  const [selectedShift, setSelectedShift] = useState('Shift 1');

  // 3-second interval tick counter
  const [tick, setTick] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Maintain separate live state for each shift
  const [shiftDataMap, setShiftDataMap] = useState(() => {
    const initialMap = {};
    Object.keys(SHIFT_DASHBOARD_DATA).forEach((shiftKey) => {
      const base = SHIFT_DASHBOARD_DATA[shiftKey];
      initialMap[shiftKey] = {
        productData: { ...base.productData },
        oeeMetrics: { ...base.oeeMetrics },
        top5Alarms: base.top5Alarms.map((alarm) => ({
          ...alarm,
          totalSeconds: timeStrToSeconds(alarm.duration)
        })),
        productionGraph: {
          labels: [...base.productionGraph.labels],
          plan: [...base.productionGraph.plan],
          actual: [...base.productionGraph.actual]
        }
      };
    });
    return initialMap;
  });

  // Machine Live Telemetry (FANUC 1 to 5)
  const [machineTelemetry, setMachineTelemetry] = useState({
    1: { status: 'Running', load: 74, rpm: 8250, cycleProgress: 45, cycleTime: '00:48', part: 'HK1A1-011-01-01' },
    2: { status: 'Running', load: 68, rpm: 7920, cycleProgress: 72, cycleTime: '00:52', part: 'HK1A1-011-01-01-EXP' },
    3: { status: 'Running', load: 81, rpm: 8400, cycleProgress: 18, cycleTime: '00:45', part: 'S4271-011-01-IN' },
    4: { status: 'Running', load: 62, rpm: 7500, cycleProgress: 88, cycleTime: '00:46', part: 'HK1A1-011-01-01' },
    5: { status: 'Running', load: 77, rpm: 8100, cycleProgress: 35, cycleTime: '00:50', part: 'S4271-011-01-IN' }
  });

  // Advance realtime data for the currently active shift
  const advanceRealtimeData = useCallback(() => {
    setLastUpdated(new Date());
    setTick((prev) => prev + 1);

    setShiftDataMap((prevMap) => {
      const current = prevMap[selectedShift] || prevMap['Shift 1'];

      // 1. Advance product counts
      const addedTotal = Math.floor(Math.random() * 8) + 8;
      const isRework = Math.random() < 0.25;
      const addedRework = isRework ? 1 : 0;
      const addedOk = addedTotal - addedRework;

      const newOk = current.productData.okCount + addedOk;
      const newRework = current.productData.reworkCount + addedRework;
      const newTotal = newOk + newRework;

      const updatedProductData = {
        ...current.productData,
        countingProduct: newTotal,
        okCount: newOk,
        reworkCount: newRework
      };

      // 2. Fluctuations in OEE
      const oeeDelta = (Math.random() - 0.48) * 3;
      const newOee = Math.min(96, Math.max(50, Math.round(current.oeeMetrics.actualOee + oeeDelta)));

      const availDelta = (Math.random() - 0.48) * 2;
      const newAvail = Math.min(98, Math.max(55, Math.round(current.oeeMetrics.availability + availDelta)));

      const perfDelta = (Math.random() - 0.48) * 2;
      const newPerf = Math.min(99, Math.max(60, Math.round(current.oeeMetrics.performance + perfDelta)));

      const qualDelta = (Math.random() - 0.48) * 2;
      const newQual = Math.min(100, Math.max(70, Math.round(current.oeeMetrics.quality + qualDelta)));

      const updatedOeeMetrics = {
        ...current.oeeMetrics,
        actualOee: newOee,
        availability: newAvail,
        performance: newPerf,
        quality: newQual
      };

      // 3. Alarms time advance
      const updatedTop5Alarms = current.top5Alarms.map((item) => {
        const deltaHours = (Math.random() - 0.47) * 0.15;
        let nextHours = Number((item.hours + deltaHours).toFixed(2));
        if (nextHours < 1.0) nextHours = 1.8;
        if (nextHours > 4.9) nextHours = 4.2;
        const nextSec = Math.round(nextHours * 3600);
        return {
          ...item,
          totalSeconds: nextSec,
          duration: secondsToTimeStr(nextSec),
          hours: nextHours
        };
      });

      // 4. Production graph slight progression
      const updatedProductionGraph = {
        ...current.productionGraph,
        actual: current.productionGraph.actual.map((val, idx) => {
          if (idx === 4) {
            const nextVal = val + Math.floor(Math.random() * 1500) + 500;
            return nextVal > 150000 ? 110000 : nextVal;
          }
          return val;
        })
      };

      return {
        ...prevMap,
        [selectedShift]: {
          productData: updatedProductData,
          oeeMetrics: updatedOeeMetrics,
          top5Alarms: updatedTop5Alarms,
          productionGraph: updatedProductionGraph
        }
      };
    });

    // 5. Update Telemetry
    setMachineTelemetry((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        const m = next[id];
        let nextProg = m.cycleProgress + Math.floor(Math.random() * 20) + 10;
        if (nextProg > 100) nextProg = nextProg % 100;

        const dRpm = Math.floor((Math.random() - 0.5) * 250);
        const newRpm = Math.min(9200, Math.max(6800, m.rpm + dRpm));

        const dLoad = Math.floor((Math.random() - 0.5) * 10);
        const newLoad = Math.min(94, Math.max(45, m.load + dLoad));

        next[id] = {
          ...m,
          cycleProgress: nextProg,
          rpm: newRpm,
          load: newLoad
        };
      });
      return next;
    });
  }, [selectedShift]);

  // 3-second data advance loop
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          advanceRealtimeData();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, advanceRealtimeData]);

  // Current shift raw state
  const activeShiftState = shiftDataMap[selectedShift] || shiftDataMap['Shift 1'];

  // Apply line multiplier
  const lineMultiplier = selectedLine === 'Line 2' ? 0.65 : selectedLine === 'Line 3' ? 0.82 : 1.0;
  const oeeOffset = selectedLine === 'Line 2' ? -3 : selectedLine === 'Line 3' ? 1 : 0;

  // Processed product data with line scaling
  const productData = useMemo(() => {
    const raw = activeShiftState.productData;
    const productionTarget = Math.round(raw.productionTarget * lineMultiplier);
    const countingProduct = Math.round(raw.countingProduct * lineMultiplier);
    const okCount = Math.round(raw.okCount * lineMultiplier);
    const reworkCount = Math.max(0, countingProduct - okCount);
    const totalParts = okCount + reworkCount;
    const ratioProductOk = totalParts > 0 ? ((okCount / totalParts) * 100).toFixed(1) : '90.0';
    const ratioProductRework = totalParts > 0 ? ((reworkCount / totalParts) * 100).toFixed(1) : '10.0';

    return {
      productionTarget,
      countingProduct,
      okCount,
      reworkCount,
      totalParts,
      ratioProductOk,
      ratioProductRework
    };
  }, [activeShiftState.productData, lineMultiplier]);

  // Processed OEE Metrics with line adjustment
  const oeeMetrics = useMemo(() => {
    const raw = activeShiftState.oeeMetrics;
    const actualOee = Math.min(100, Math.max(35, raw.actualOee + oeeOffset));
    const availability = Math.min(100, Math.max(40, raw.availability + Math.round(oeeOffset * 0.8)));
    const performance = Math.min(100, Math.max(40, raw.performance + Math.round(oeeOffset * 0.6)));
    const quality = Math.min(100, Math.max(50, raw.quality));

    return {
      actualOee,
      targetOee: raw.targetOee,
      availability,
      performance,
      quality
    };
  }, [activeShiftState.oeeMetrics, oeeOffset]);

  // Processed Production Graph
  const productionGraph = useMemo(() => {
    const raw = activeShiftState.productionGraph;
    return {
      labels: raw.labels,
      plan: raw.plan.map((v) => Math.round(v * lineMultiplier)),
      actual: raw.actual.map((v) => Math.round(v * lineMultiplier))
    };
  }, [activeShiftState.productionGraph, lineMultiplier]);

  const top5Alarms = activeShiftState.top5Alarms;

  const value = {
    selectedLine,
    setSelectedLine,
    selectedShift,
    setSelectedShift,
    tick,
    secondsLeft,
    lastUpdated,
    isLive,
    setIsLive,
    productData,
    oeeMetrics,
    top5Alarms,
    productionGraph,
    machineTelemetry,
    advanceRealtimeData
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
