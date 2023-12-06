import { ReservationItem, SelectedColumns } from "./types";

import moment, { Moment } from 'moment';

type Unit = moment.unitOfTime.DurationConstructor;

export function dateRange(start: string, length: number, unit: Unit, format = 'D') {
  return [...Array(length)].map((nu, i) => {
    return resolveDate(start, i, unit, format);
  });
}

export function resolveDate(start: string, count: number, unit: Unit, format: string) {
  return moment(start).add(count, unit).format(format);
}

export function resolveDateDiff(
  startDate: string | Moment,
  date: string | Moment,
  format = 'DD-MM-YYYY'
) {
  const a = typeof startDate === 'string' ? moment(startDate, format).startOf('day') : startDate;
  const b = typeof date === 'string' ? moment(date, format).startOf('day') : date;

  return b.diff(a, 'days');
}

export function generateColumnTitles(props: {
  date: string;
  columnCount: number;
  selectedColumns: SelectedColumns;
}) {
  return dateRange(props.date, props.columnCount, 'days').map((val, index) => {
    return (
      <div
        key={val}
        style={{
          background: props.selectedColumns[index] ? '#1ca3f9' : '#fff',
          height: '100%',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontWeight: 500
        }}
      >
        <div>{val}</div>
      </div>
    );
  });
}

export function generateRowTitles(reservationItems: ReservationItem[], dropRowIndex: number | null) {
  return reservationItems.map((room, index) => {
    return (
      <div>
        <div
          style={{
            padding: '3px',
            display: 'flex',
            alignContent: 'center',
            background: dropRowIndex === index ? '#1ca3f9' : room.background
          }}
        >
          <div style={{ fontSize: '13px', marginRight: '10px' }}>{room.number}</div>
          <div>{room.name}</div>
        </div>
      </div>
    );
  });
}

export function calculateLinePoint(
  column: number,
  columnWidth: number,
  columnTitleHeight: number,
  row: number,
  rowHeight: number,
  rowTitleWidth: number
) {
  return {
    x: column * columnWidth + rowTitleWidth,
    y: (row + 0.5) * rowHeight + columnTitleHeight
  };
}