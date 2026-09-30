import dayjs from 'dayjs';
import rawCsv from './alarm_history.csv?raw';

/**
 * Parses the raw alarm history CSV content into structured alarm objects.
 * CSV Columns:
 * 0: Alarm ID
 * 1: Machine
 * 2: Alarm Code
 * 3: Alarm Type
 * 4: Alarm Message
 * 5: Severity
 * 6: Status
 * 7: Axis / System
 * 8: Triggered At
 * 9: Duration
 * 10: Acknowledged By
 * 11: Resolved At
 */
export function parseAlarmCsv(csvText) {
  if (!csvText) return [];
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const codeIdx = headers.indexOf('Alarm Code');
  const msgIdx = headers.indexOf('Alarm Message');
  const durIdx = headers.indexOf('Duration');
  const trigIdx = headers.indexOf('Triggered At');
  const idIdx = headers.indexOf('Alarm ID');
  const machineIdx = headers.indexOf('Machine');
  const typeIdx = headers.indexOf('Alarm Type');
  const sevIdx = headers.indexOf('Severity');
  const statusIdx = headers.indexOf('Status');
  const axisIdx = headers.indexOf('Axis / System');

  const rows = [];
  let rowNo = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(',');

    const code = (cols[codeIdx !== -1 ? codeIdx : 2] || '').trim();
    const message = (cols[msgIdx !== -1 ? msgIdx : 4] || '').trim();
    const rawDuration = (cols[durIdx !== -1 ? durIdx : 9] || '').trim();
    const rawTimestamp = (cols[trigIdx !== -1 ? trigIdx : 8] || '').trim();

    // Format duration: strip leading zero for single-digit hour: 00:37:47 -> 0:37:47, 02:18:36 -> 2:18:36
    let duration = rawDuration;
    const durParts = rawDuration.split(':');
    if (durParts.length === 3) {
      duration = `${parseInt(durParts[0], 10)}:${durParts[1]}:${durParts[2]}`;
    }

    // Format timestamp: parse YYYY-MM-DD HH:mm:ss -> DD/MM/YYYY HH:mm:ss
    const parsedDate = dayjs(rawTimestamp, 'YYYY-MM-DD HH:mm:ss');
    const formattedTimestamp = parsedDate.isValid()
      ? parsedDate.format('DD/MM/YYYY HH:mm:ss')
      : rawTimestamp;

    // Determine Shift based on time of Triggered At
    // Shift 1: 07:35 - 16:00
    // Shift 2: 16:00 - 24:00
    // Shift 3: 00:00 - 07:35
    let shift = 'Shift 1';
    if (parsedDate.isValid()) {
      const minutes = parsedDate.hour() * 60 + parsedDate.minute();
      if (minutes >= 7 * 60 + 35 && minutes < 16 * 60) {
        shift = 'Shift 1';
      } else if (minutes >= 16 * 60) {
        shift = 'Shift 2';
      } else {
        shift = 'Shift 3';
      }
    }

    rows.push({
      no: rowNo++,
      code,
      message,
      duration,
      rawDuration,
      timestamp: formattedTimestamp,
      rawTimestamp,
      shift,
      id: cols[idIdx !== -1 ? idIdx : 0]?.trim(),
      machine: cols[machineIdx !== -1 ? machineIdx : 1]?.trim(),
      type: cols[typeIdx !== -1 ? typeIdx : 3]?.trim(),
      severity: cols[sevIdx !== -1 ? sevIdx : 5]?.trim(),
      status: cols[statusIdx !== -1 ? statusIdx : 6]?.trim(),
      axis: cols[axisIdx !== -1 ? axisIdx : 7]?.trim()
    });
  }

  return rows;
}

export const ALARM_HISTORY_DATA = parseAlarmCsv(rawCsv);
export default ALARM_HISTORY_DATA;
