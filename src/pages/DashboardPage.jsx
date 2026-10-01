import React, { useState } from 'react';
import {
  Settings,
  X,
  Timer,
  Package,
  CheckCircle2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import AntDateRangePicker from '../components/AntDateRangePicker';
import CustomDropdown from '../components/CustomDropdown';
import ModalPortal from '../components/ModalPortal';
import Toast from '../components/Toast';
import { useRealtime } from '../context/RealtimeContext';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SHIFT_OPTIONS = ['Shift 1', 'Shift 2', 'Shift 3'];

export default function DashboardPage() {
  const {
    secondsLeft,
    productData,
    oeeMetrics,
    top5Alarms,
    productionGraph
  } = useRealtime();

  const [selectedShift, setSelectedShift] = useState('Shift 1');
  const [dateRange, setDateRange] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetOee, setTargetOee] = useState(100);
  const [tempTargetOee, setTempTargetOee] = useState(100);
  const [toast, setToast] = useState(null);

  // Top 5 Alarm Chart Data (Horizontal Bar) - All bright blue bars matching screenshot
  const alarmChartData = {
    labels: top5Alarms.map((a) => a.name),
    datasets: [
      {
        label: 'Duration',
        data: top5Alarms.map((a) => a.hours),
        backgroundColor: '#2F80ED',
        hoverBackgroundColor: '#1E6AD1',
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 22
      }
    ]
  };

  const alarmChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E232F',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => {
            const item = top5Alarms[ctx.dataIndex];
            return `Duration: ${item?.duration || ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 5,
        grid: {
          color: '#F2F4F7',
          drawBorder: false
        },
        ticks: {
          color: '#475467',
          font: { size: 11, family: 'Inter, sans-serif' },
          stepSize: 1,
          callback: (val) => {
            if (val === 0) return '';
            return `0${val}:00:00`;
          }
        }
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#1E232F',
          font: { size: 12, weight: '500', family: 'Inter, sans-serif' },
          padding: 8
        }
      }
    }
  };

  // Plugin to draw vertical text labels inside bars (matching screenshot 150.000, 125.000, etc.)
  const verticalBarTextPlugin = {
    id: 'verticalBarTextPlugin',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const val = dataset.data[index];
          if (val && bar.height > 25) {
            ctx.save();
            ctx.translate(bar.x, bar.y + (bar.base - bar.y) / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const formatted = Number(val).toLocaleString('id-ID');
            ctx.fillText(formatted, 0, 0);
            ctx.restore();
          }
        });
      });
    }
  };

  // Production Graph Data (Grouped Bar Actual vs Plan)
  const productionChartData = {
    labels: productionGraph.labels,
    datasets: [
      {
        label: 'Actual',
        data: productionGraph.actual,
        backgroundColor: '#2F80ED',
        hoverBackgroundColor: '#1E6AD1',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      },
      {
        label: 'Plan',
        data: productionGraph.plan,
        backgroundColor: '#00A854',
        hoverBackgroundColor: '#008C45',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      }
    ]
  };

  const productionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1E232F',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1E232F',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('id-ID')} pcs`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#475467',
          font: { size: 12, family: 'Inter, sans-serif' }
        }
      },
      y: {
        min: 0,
        max: 150000,
        grid: {
          color: '#F2F4F7',
          drawBorder: false
        },
        ticks: {
          color: '#475467',
          font: { size: 11, family: 'Inter, sans-serif' },
          stepSize: 25000,
          callback: (val) => {
            if (val === 75000 || val === 125000) return '';
            return Number(val).toLocaleString('id-ID');
          }
        }
      }
    }
  };

  // Product Realtime Status (Doughnut Chart) with gap and rounded corners matching Figma & Image 1
  const donutChartData = {
    labels: ['OK', 'Rework'],
    datasets: [
      {
        data: [productData.okCount, productData.reworkCount],
        backgroundColor: ['#00A854', '#F04438'],
        borderWidth: 0,
        borderRadius: 12,
        spacing: 6,
        hoverOffset: 0
      }
    ]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E232F',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} pcs (${Math.round((ctx.raw / (productData.totalParts || 1)) * 100)}%)`
        }
      }
    }
  };

  const handleSaveTarget = (e) => {
    e.preventDefault();
    setTargetOee(Number(tempTargetOee));
    setShowTargetModal(false);
    setToast({
      type: 'success',
      title: 'Target OEE Diperbarui',
      message: `Target OEE berhasil diset ke ${tempTargetOee}%.`
    });
  };

  return (
    <>
      <div className="space-y-5">
        {/* Top Header Card matching user screenshot - exact height alignment, NO setting button */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Visualize actual oil volume
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Shift Select - Height 38px matching DateRangePicker */}
            <div className="w-28">
              <CustomDropdown
                value={selectedShift}
                onChange={setSelectedShift}
                options={SHIFT_OPTIONS}
                placeholder="Shift 1"
              />
            </div>

            {/* Ant Design Date Range Picker - Height 38px matching Shift Dropdown */}
            <AntDateRangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
        </div>

        {/* 4 Top KPI Metric Cards matching user screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Current OEE */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Current OEE
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {oeeMetrics.actualOee}%
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Timer className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 2: Production Target */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Production Target
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {productData.productionTarget.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Package className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 3: Counting Product */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Counting Product
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {productData.countingProduct.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Package className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 4: Rasio Product OK */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Rasio Product OK
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {productData.ratioProductOk}%
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>
        </div>

        {/* Mid Section: 2 Charts Grid (Top 5 Alarm & Production Graph) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Top 5 Alarm */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#1E232F]">Top 5 Alarm</h3>
              <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
            </div>

            <div className="h-64 w-full relative">
              <Bar
                data={alarmChartData}
                options={alarmChartOptions}
              />
            </div>
          </div>

          {/* Chart 2: Production Graph */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#1E232F]">Production Graph</h3>
              <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
            </div>

            <div className="h-64 w-full relative">
              <Bar
                data={productionChartData}
                options={productionChartOptions}
                plugins={[verticalBarTextPlugin]}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: OEE Breakdown & Product Realtime Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: OEE Breakdown */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E232F]">OEE Breakdown</h3>
                <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempTargetOee(targetOee);
                  setShowTargetModal(true);
                }}
                className="p-1.5 border border-[#D0D5DD] hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-xs"
                title="Setting Target OEE"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Progress Bars matching user screenshot */}
            <div className="space-y-3.5">
              {/* Actual OEE */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1E232F]">Actual OEE</span>
                  <span className="text-[#1E232F] font-bold transition-all duration-300">{oeeMetrics.actualOee}%</span>
                </div>
                <div className="w-full bg-[#F2F4F7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00A854] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${oeeMetrics.actualOee}%` }}
                  />
                </div>
              </div>

              {/* Target OEE */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1E232F]">Target OEE</span>
                  <span className="text-[#1E232F] font-bold transition-all duration-300">{targetOee}%</span>
                </div>
                <div className="w-full bg-[#F2F4F7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2F80ED] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(targetOee, 100)}%` }}
                  />
                </div>
              </div>

              {/* Avaibility */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1E232F]">Avaibility</span>
                  <span className="text-[#1E232F] font-bold transition-all duration-300">{oeeMetrics.availability}%</span>
                </div>
                <div className="w-full bg-[#F2F4F7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FA8C16] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${oeeMetrics.availability}%` }}
                  />
                </div>
              </div>

              {/* Performance */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1E232F]">Performance</span>
                  <span className="text-[#1E232F] font-bold transition-all duration-300">{oeeMetrics.performance}%</span>
                </div>
                <div className="w-full bg-[#F2F4F7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#722ED1] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${oeeMetrics.performance}%` }}
                  />
                </div>
              </div>

              {/* Quality */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1E232F]">Quality</span>
                  <span className="text-[#1E232F] font-bold transition-all duration-300">{oeeMetrics.quality}%</span>
                </div>
                <div className="w-full bg-[#F2F4F7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F04438] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${oeeMetrics.quality}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Product Realtime Status with curved doughnut gap matching Image 1 */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#1E232F]">Product Realtime Status</h3>
              <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
            </div>

            <div className="flex-1 flex items-center justify-around">
              {/* Doughnut enlarged to fill the box proportionally */}
              <div className="relative w-56 h-56 flex-shrink-0">
                <Doughnut data={donutChartData} options={donutChartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500 font-medium">Total</span>
                  <span className="text-3xl font-extrabold text-[#1E232F] tracking-tight transition-all duration-300">
                    {productData.totalParts.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Legend & Details matching screenshot */}
              <div className="space-y-6 text-sm min-w-[160px]">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00A854] flex-shrink-0" />
                    <span className="font-semibold text-gray-800">OK</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#1E232F] leading-none transition-all duration-300">
                      {productData.ratioProductOk}%
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mt-1 transition-all duration-300">
                      ({productData.okCount.toLocaleString('id-ID')} pcs)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F04438] flex-shrink-0" />
                    <span className="font-semibold text-gray-800">Rework</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#1E232F] leading-none transition-all duration-300">
                      {productData.ratioProductRework}%
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mt-1 transition-all duration-300">
                      ({productData.reworkCount.toLocaleString('id-ID')} pcs)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Setting Target OEE matching Image 2 & Project Quality Development style */}
      {showTargetModal && (
        <ModalPortal isOpen={showTargetModal} onClose={() => setShowTargetModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E232F]">Edit Target OEE</h3>
                <p className="text-xs text-gray-400 mt-1">
                  This field is for desc terms of service
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTarget} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={tempTargetOee}
                    onChange={(e) => setTempTargetOee(e.target.value)}
                    className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#1E232F] focus:outline-none focus:border-[#00A854] pr-10"
                    placeholder="100"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                    %
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="px-6 py-2.5 border border-[#D0D5DD] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* Toast */}
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
