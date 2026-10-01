import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TOP_5_ALARMS_DATA, PRODUCTION_GRAPH_DATA } from '../data/mockData';

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
  // 3-second interval tick counter
  const [tick, setTick] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // 1. KPI & Product Count State
  const [productData, setProductData] = useState({
    countingProduct: 1284,
    productionTarget: 1284,
    okCount: 1156,
    reworkCount: 128
  });

  // 2. OEE Breakdown State
  const [oeeMetrics, setOeeMetrics] = useState({
    actualOee: 50,
    targetOee: 100,
    availability: 50,
    performance: 80,
    quality: 20
  });

  // 3. Top 5 Alarms Data with live ticking durations
  const [top5Alarms, setTop5Alarms] = useState(() => {
    return TOP_5_ALARMS_DATA.map((alarm) => ({
      ...alarm,
      totalSeconds: timeStrToSeconds(alarm.duration)
    }));
  });

  // 4. Production Graph Data (Actual vs Plan per day)
  const [productionGraph, setProductionGraph] = useState(() => ({
    labels: [...PRODUCTION_GRAPH_DATA.labels],
    plan: [...PRODUCTION_GRAPH_DATA.plan],
    actual: [...PRODUCTION_GRAPH_DATA.actual]
  }));

  // 5. Machine Live Telemetry (FANUC 1 to 5)
  const [machineTelemetry, setMachineTelemetry] = useState({
    1: { status: 'Running', load: 74, rpm: 8250, cycleProgress: 45, cycleTime: '00:48', part: 'HK1A1-011-01-01' },
    2: { status: 'Running', load: 68, rpm: 7920, cycleProgress: 72, cycleTime: '00:52', part: 'HK1A1-011-01-01-EXP' },
    3: { status: 'Running', load: 81, rpm: 8400, cycleProgress: 18, cycleTime: '00:45', part: 'S4271-011-01-IN' },
    4: { status: 'Running', load: 62, rpm: 7500, cycleProgress: 88, cycleTime: '00:46', part: 'HK1A1-011-01-01' },
    5: { status: 'Running', load: 77, rpm: 8100, cycleProgress: 35, cycleTime: '00:50', part: 'S4271-011-01-IN' }
  });

  // Trigger one realtime step update
  const advanceRealtimeData = useCallback(() => {
    setLastUpdated(new Date());
    setTick((prev) => prev + 1);

    // 1. Update Product counts: add 12 to 24 parts so numbers visibly advance
    setProductData((prev) => {
      const addedTotal = Math.floor(Math.random() * 12) + 12; // +12 to +23 pcs
      const isRework = Math.random() < 0.35;
      const addedRework = isRework ? Math.floor(Math.random() * 3) + 1 : 0;
      const addedOk = addedTotal - addedRework;

      const newOk = prev.okCount + addedOk;
      const newRework = prev.reworkCount + addedRework;
      const newTotal = newOk + newRework;

      return {
        ...prev,
        countingProduct: newTotal,
        okCount: newOk,
        reworkCount: newRework
      };
    });

    // 2. Update OEE Breakdown with prominent, visible live fluctuations
    setOeeMetrics((prev) => {
      const oeeDelta = (Math.random() - 0.45) * 8; // ±4% to ±7% change
      const newOee = Math.min(88, Math.max(50, Math.round(prev.actualOee + oeeDelta)));

      const availDelta = (Math.random() - 0.45) * 9;
      const newAvail = Math.min(96, Math.max(55, Math.round(prev.availability + availDelta)));

      const perfDelta = (Math.random() - 0.45) * 8;
      const newPerf = Math.min(95, Math.max(68, Math.round(prev.performance + perfDelta)));

      const qualDelta = (Math.random() - 0.45) * 7;
      const newQual = Math.min(98, Math.max(30, Math.round(prev.quality + qualDelta)));

      return {
        ...prev,
        actualOee: newOee,
        availability: newAvail,
        performance: newPerf,
        quality: newQual
      };
    });

    // 3. Top 5 Alarms: vary hours visibly (±0.2 to ±0.5 hrs) so horizontal bars visibly move & animate
    setTop5Alarms((prev) => {
      return prev.map((item) => {
        const deltaHours = (Math.random() - 0.46) * 0.45;
        let nextHours = Number((item.hours + deltaHours).toFixed(2));
        if (nextHours < 2.0) nextHours = 2.4 + Math.random() * 0.6;
        if (nextHours > 4.88) nextHours = 4.4 - Math.random() * 0.5;
        nextHours = Number(nextHours.toFixed(2));

        const nextSec = Math.round(nextHours * 3600);
        return {
          ...item,
          totalSeconds: nextSec,
          duration: secondsToTimeStr(nextSec),
          hours: nextHours
        };
      });
    });

    // 4. Update Production Graph: actual bars visibly jump / grow (+8,000 to +18,000 pcs)
    setProductionGraph((prev) => {
      const newActual = prev.actual.map((val, idx) => {
        // Jumat (last bar) actively climbs or resets on completion
        if (idx === 4) {
          let nextVal = val + Math.floor(Math.random() * 14000) + 8000;
          if (nextVal > 146000) nextVal = 65000 + Math.floor(Math.random() * 15000);
          return nextVal;
        }
        // Mid-week days have dynamic variations (±5000 to ±10000 pcs)
        const shift = Math.floor((Math.random() - 0.48) * 10000);
        return Math.min(150000, Math.max(38000, val + shift));
      });

      return {
        ...prev,
        actual: newActual
      };
    });

    // 5. Update Machine Telemetry: RPM, Load, Cycle progress move visibly
    setMachineTelemetry((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        const m = next[id];
        // Cycle progress advances visibly
        let nextProg = m.cycleProgress + Math.floor(Math.random() * 25) + 15;
        if (nextProg > 100) nextProg = nextProg % 100;

        // RPM fluctuation ±350
        const dRpm = Math.floor((Math.random() - 0.5) * 500);
        const newRpm = Math.min(9200, Math.max(6800, m.rpm + dRpm));

        // Load fluctuation ±10%
        const dLoad = Math.floor((Math.random() - 0.5) * 18);
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
  }, []);

  // 3-second data advance loop (with 3s countdown ticker)
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

  // Derived values
  const totalParts = productData.okCount + productData.reworkCount;
  const ratioProductOk = totalParts > 0 ? ((productData.okCount / totalParts) * 100).toFixed(1) : '90.0';
  const ratioProductRework = totalParts > 0 ? ((productData.reworkCount / totalParts) * 100).toFixed(1) : '10.0';

  const value = {
    tick,
    secondsLeft,
    lastUpdated,
    isLive,
    setIsLive,
    productData: {
      ...productData,
      totalParts,
      ratioProductOk,
      ratioProductRework
    },
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
