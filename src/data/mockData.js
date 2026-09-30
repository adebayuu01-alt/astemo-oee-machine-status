// ==========================================
// ASTEMO - OEE MACHINE STATUS MOCK DATA
// ==========================================

export const INITIAL_USERS = [
  {
    id: 1,
    idCard: 'AST-SA-001',
    name: 'Kevin Pratama',
    username: 'kevin_astemo',
    role: 'Superadmin',
    datetime: '06/09/2026 12:00',
    password: 'kevin12345',
    passwordMasked: '*****************'
  },
  {
    id: 2,
    idCard: 'AST-OP-002',
    name: 'Suep Suryadi',
    username: 'suep_astemo',
    role: 'Operator',
    datetime: '06/09/2026 12:00',
    password: 'suep12345',
    passwordMasked: '*****************'
  },
  {
    id: 3,
    idCard: 'AST-OP-003',
    name: 'Budi CNC',
    username: 'budi_cnc',
    role: 'Operator',
    datetime: '07/09/2026 08:30',
    password: 'budi12345',
    passwordMasked: '*****************'
  },
  {
    id: 4,
    idCard: 'AST-ENG-004',
    name: 'Andi Maintenance',
    username: 'andi_maint',
    role: 'Engineer',
    datetime: '08/09/2026 14:15',
    password: 'andi12345',
    passwordMasked: '*****************'
  }
];

export const INITIAL_ROLES = [
  {
    id: 1,
    role: 'Superadmin',
    menus: [
      'Dashboard',
      'Machine Status',
      'Planning Production',
      'Notification',
      'User Management',
      'Role Management',
      'Master Data',
      'Register'
    ],
    permissions: [
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete'
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    role: 'Admin',
    menus: [
      'Dashboard',
      'Machine Status',
      'Planning Production',
      'Notification',
      'User Management',
      'Role Management',
      'Master Data',
      'Register'
    ],
    permissions: [
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete'
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    role: 'Operator',
    menus: ['Dashboard', 'Machine Status', 'Notification'],
    permissions: ['Read', 'Read', 'Read'],
    datetime: '07/09/2026 09:00'
  }
];

export const INITIAL_LINES = [
  { id: 1, line: 'Line 1', datetime: '06/09/2026 12:00' },
  { id: 2, line: 'Line 2', datetime: '06/09/2026 12:00' },
  { id: 3, line: 'Line 3', datetime: '08/09/2026 10:00' }
];

export const INITIAL_MACHINES = [
  { id: 1, machine: 'FANUC 1', code: 'CNC-01', status: 'Running', model: 'Robodrill α-D21LiB5', datetime: '06/09/2026 12:00' },
  { id: 2, machine: 'FANUC 2', code: 'CNC-02', status: 'Running', model: 'Robodrill α-D21MiB5', datetime: '06/09/2026 12:00' },
  { id: 3, machine: 'FANUC 3', code: 'CNC-03', status: 'Stop', model: 'Robodrill α-D14LiB5', datetime: '06/09/2026 12:00' },
  { id: 4, machine: 'FANUC 4', code: 'CNC-04', status: 'Running', model: 'Robodrill α-D21SiB5', datetime: '06/09/2026 12:00' },
  { id: 5, machine: 'FANUC 5', code: 'CNC-05', status: 'Running', model: 'Robodrill α-D21LiB5', datetime: '06/09/2026 12:00' }
];

export const INITIAL_SHIFTS = [
  { id: 1, shift: 'Shift 1', startTime: '08:00', endTime: '16:00', datetime: '06/09/2026 12:00' },
  { id: 2, shift: 'Shift 2', startTime: '16:00', endTime: '24:00', datetime: '06/09/2026 12:00' },
  { id: 3, shift: 'Shift 3', startTime: '24:00', endTime: '08:00', datetime: '06/09/2026 12:00' }
];

export const INITIAL_REGISTERS = [
  {
    id: 1,
    line: 'Line 1',
    machines: ['FANUC 1', 'FANUC 2', 'FANUC 3', 'FANUC 4', 'FANUC 5'],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    line: 'Line 2',
    machines: ['FANUC 1', 'FANUC 2', 'FANUC 3'],
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_PLANNING = [
  {
    id: 1,
    period: '07 September - 11 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    period: '14 September - 18 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    period: '21 September - 25 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Spindle speed over the limit in FANUC 1',
    description: 'The spindle speed has reached 8,500 RPM. Please check the machine!',
    machine: 'FANUC 1',
    time: '1h Ago',
    severity: 'Critical',
    isRead: false
  },
  {
    id: 2,
    title: 'Spindle temperature over the limit in FANUC 2',
    description: 'The spindle temperature has reached 85°C. Please check the machine!',
    machine: 'FANUC 2',
    time: '1h Ago',
    severity: 'Critical',
    isRead: false
  },
  {
    id: 3,
    title: 'Coolant level is low in FANUC 3',
    description: 'The coolant level has dropped to 18%. Please refill the coolant!',
    machine: 'FANUC 3',
    time: '1h Ago',
    severity: 'Warning',
    isRead: false
  },
  {
    id: 4,
    title: 'X-axis servo alarm detected in FANUC 4',
    description: 'An alarm has been detected on the X-axis servo. Please check the machine!',
    machine: 'FANUC 4',
    time: '1h Ago',
    severity: 'Critical',
    isRead: true
  },
  {
    id: 5,
    title: 'X-axis overtravel detected in FANUC 5',
    description: 'The X-axis has reached its positive travel limit. Please check the machine!',
    machine: 'FANUC 5',
    time: '1h Ago',
    severity: 'Warning',
    isRead: true
  },
  {
    id: 6,
    title: 'Spindle load over the limit in FANUC 6',
    description: 'The spindle load has reached 118%. Please check the machine!',
    machine: 'FANUC 6',
    time: '1h Ago',
    severity: 'Critical',
    isRead: true
  },
  {
    id: 7,
    title: 'CNC communication error in FANUC 7',
    description: 'The connection to FANUC 7 has been interrupted. Please check the connection!',
    machine: 'FANUC 7',
    time: '1h Ago',
    severity: 'Critical',
    isRead: true
  }
];

export const INITIAL_ALARMS = [
  { id: 'ALM-0001', code: 'AL-1011', machine: 'FANUC 1', description: 'Air Pressure Low', severity: 'Warning', status: 'Acknowledged', parameter: 'Air Pressure', value: '3.2', unit: 'bar', triggeredAt: '2026-09-30 09:13:31', duration: '00:30:48', acknowledgedBy: 'Budi' },
  { id: 'ALM-0003', code: 'AL-1007', machine: 'FANUC 1', description: 'Spindle Motor Overload', severity: 'Critical', status: 'Active', parameter: 'Spindle Load', value: '118', unit: '%', triggeredAt: '2026-09-30 09:09:13', duration: '00:33:05', acknowledgedBy: '-' },
  { id: 'ALM-0010', code: 'AL-1004', machine: 'FANUC 1', description: 'Tool Life Exceeded', severity: 'Warning', status: 'Active', parameter: 'Tool Life', value: '102', unit: '%', triggeredAt: '2026-09-30 08:52:36', duration: '00:49:42', acknowledgedBy: '-' },
  { id: 'ALM-0016', code: 'AL-1007', machine: 'FANUC 3', description: 'Spindle Motor Overload', severity: 'Critical', status: 'Resolved', parameter: 'Spindle Load', value: '118', unit: '%', triggeredAt: '2026-09-30 08:32:05', duration: '01:17:46', acknowledgedBy: 'Dimas' },
  { id: 'ALM-0035', code: 'AL-1004', machine: 'FANUC 1', description: 'Tool Life Exceeded', severity: 'Warning', status: 'Resolved', parameter: 'Tool Life', value: '102', unit: '%', triggeredAt: '2026-09-30 08:26:33', duration: '00:31:35', acknowledgedBy: 'Andi' },
  { id: 'ALM-0050', code: 'AL-1001', machine: 'FANUC 5', description: 'Spindle Overheat', severity: 'Critical', status: 'Active', parameter: 'Temperature', value: '85', unit: '°C', triggeredAt: '2026-09-30 08:16:24', duration: '01:25:54', acknowledgedBy: '-' },
  { id: 'ALM-0020', code: 'AL-1009', machine: 'FANUC 4', description: 'Z-Axis Position Error', severity: 'Critical', status: 'Active', parameter: 'Position Error', value: '0.82', unit: 'mm', triggeredAt: '2026-09-30 08:05:30', duration: '01:36:48', acknowledgedBy: '-' },
  { id: 'ALM-0037', code: 'AL-1005', machine: 'FANUC 4', description: 'Emergency Stop Activated', severity: 'Critical', status: 'Active', parameter: 'Safety Status', value: 'E-STOP', unit: '', triggeredAt: '2026-09-30 05:59:44', duration: '03:42:34', acknowledgedBy: '-' },
  { id: 'ALM-0015', code: 'AL-1014', machine: 'FANUC 1', description: 'Lubrication Level Low', severity: 'Warning', status: 'Active', parameter: 'Lubricant Level', value: '15', unit: '%', triggeredAt: '2026-09-30 05:44:26', duration: '03:57:52', acknowledgedBy: '-' },
  { id: 'ALM-0029', code: 'AL-1011', machine: 'FANUC 4', description: 'Air Pressure Low', severity: 'Warning', status: 'Resolved', parameter: 'Air Pressure', value: '3.2', unit: 'bar', triggeredAt: '2026-09-30 05:43:24', duration: '01:04:14', acknowledgedBy: 'Budi' },
  { id: 'ALM-0011', code: 'AL-1002', machine: 'FANUC 2', description: 'Coolant Pump Failure', severity: 'Critical', status: 'Resolved', parameter: 'Flow Rate', value: '0', unit: 'L/min', triggeredAt: '2026-09-30 05:22:38', duration: '00:32:02', acknowledgedBy: 'Suep' },
  { id: 'ALM-0005', code: 'AL-1015', machine: 'FANUC 3', description: 'Communication Timeout', severity: 'Warning', status: 'Resolved', parameter: 'Latency', value: '2500', unit: 'ms', triggeredAt: '2026-09-30 04:51:30', duration: '00:54:19', acknowledgedBy: 'Andi' },
  { id: 'ALM-0027', code: 'AL-1003', machine: 'FANUC 2', description: 'X-Axis Servo Error', severity: 'Critical', status: 'Resolved', parameter: 'Tracking Error', value: '1.45', unit: 'mm', triggeredAt: '2026-09-30 04:14:44', duration: '00:31:07', acknowledgedBy: 'Kevin' }
];

export const INITIAL_MACHINE_TIMELINE = [
  {
    machine: 'FANUC 1',
    model: 'Robodrill α-D21LiB5',
    status: 'Running',
    operator: 'Suep Suryadi',
    part: 'HK1A1-011-01-01',
    segments: [
      { start: '07:35', end: '09:00', status: 'Running', label: 'Running' },
      { start: '09:00', end: '09:20', status: 'Stop', label: 'Tool Life Exceeded' },
      { start: '09:20', end: '11:45', status: 'Running', label: 'Running' },
      { start: '11:45', end: '12:30', status: 'Idle', label: 'Lunch Break' },
      { start: '12:30', end: '14:30', status: 'Running', label: 'Running' },
      { start: '14:30', end: '14:50', status: 'Stop', label: 'Air Pressure Low' },
      { start: '14:50', end: '16:00', status: 'Running', label: 'Running' }
    ]
  },
  {
    machine: 'FANUC 2',
    model: 'Robodrill α-D21MiB5',
    status: 'Running',
    operator: 'Budi CNC',
    part: 'HK1A1-011-01-01-EXP-PHPH',
    segments: [
      { start: '07:35', end: '10:15', status: 'Running', label: 'Running' },
      { start: '10:15', end: '10:35', status: 'Stop', label: 'Coolant Pump Failure' },
      { start: '10:35', end: '11:45', status: 'Running', label: 'Running' },
      { start: '11:45', end: '12:30', status: 'Idle', label: 'Lunch Break' },
      { start: '12:30', end: '16:00', status: 'Running', label: 'Running' }
    ]
  },
  {
    machine: 'FANUC 3',
    model: 'Robodrill α-D14LiB5',
    status: 'Stop',
    operator: 'Dimas Operator',
    part: 'S4271-011-01-IN',
    segments: [
      { start: '07:35', end: '08:30', status: 'Running', label: 'Running' },
      { start: '08:30', end: '10:00', status: 'Stop', label: 'Spindle Motor Overload' },
      { start: '10:00', end: '11:45', status: 'Running', label: 'Running' },
      { start: '11:45', end: '12:30', status: 'Idle', label: 'Lunch Break' },
      { start: '12:30', end: '13:45', status: 'Running', label: 'Running' },
      { start: '13:45', end: '16:00', status: 'Stop', label: 'Coolant Level Low' }
    ]
  },
  {
    machine: 'FANUC 4',
    model: 'Robodrill α-D21SiB5',
    status: 'Running',
    operator: 'Andi Maint',
    part: 'HK1A1-011-01-01',
    segments: [
      { start: '07:35', end: '11:45', status: 'Running', label: 'Running' },
      { start: '11:45', end: '12:30', status: 'Idle', label: 'Lunch Break' },
      { start: '12:30', end: '15:10', status: 'Running', label: 'Running' },
      { start: '15:10', end: '15:30', status: 'Stop', label: 'Z-Axis Position Error' },
      { start: '15:30', end: '16:00', status: 'Running', label: 'Running' }
    ]
  },
  {
    machine: 'FANUC 5',
    model: 'Robodrill α-D21LiB5',
    status: 'Running',
    operator: 'Kevin Pratama',
    part: 'S4271-011-01-IN',
    segments: [
      { start: '07:35', end: '08:15', status: 'Running', label: 'Running' },
      { start: '08:15', end: '09:40', status: 'Stop', label: 'Spindle Overheat' },
      { start: '09:40', end: '11:45', status: 'Running', label: 'Running' },
      { start: '11:45', end: '12:30', status: 'Idle', label: 'Lunch Break' },
      { start: '12:30', end: '16:00', status: 'Running', label: 'Running' }
    ]
  }
];

export const TOP_5_ALARMS_DATA = [
  { name: 'Coolant Temperature High', duration: '04:35:00', hours: 4.58 },
  { name: 'DC Link Undervoltage', duration: '04:12:00', hours: 4.22 },
  { name: 'DSEthernet Communication Error', duration: '04:26:00', hours: 4.43 },
  { name: 'Overtravel: +Z', duration: '04:45:00', hours: 4.75 },
  { name: 'Lubricant Pressure Low', duration: '04:45:00', hours: 4.75 }
];

export const PRODUCTION_GRAPH_DATA = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  actual: [150000, 125000, 50000, 100000, 75000],
  plan: [150000, 150000, 150000, 150000, 100000]
};

