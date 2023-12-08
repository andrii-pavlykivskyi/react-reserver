import { ReservationItem } from './types';

import moment, { Moment } from 'moment';

type Unit = moment.unitOfTime.DurationConstructor;

export function dateRange(start: string, length: number, unit: Unit): Date[] {
  return [...Array(length)].map((_, i) => {
    return resolveDate(start, i, unit);
  });
}

export function resolveDate(start: string, count: number, unit: Unit) {
  return moment(start).add(count, unit).toDate();
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

export function generateRowTitles(
  reservationItems: ReservationItem[],
  dropRowIndex: number | null
) {
  return reservationItems.map((room, index) => {
    return (
      <div style={{ height: '100%' }}>
        <div
          style={{
            height: '100%',
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
