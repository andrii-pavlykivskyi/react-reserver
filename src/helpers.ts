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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObjectEmpty(obj: any) {
  for (const i in obj) return false;
  return true;
}
