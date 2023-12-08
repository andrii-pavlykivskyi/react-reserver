import React, { FC, useState } from 'react';
import Reserver from './../lib/main';
import { HeaderCellProps } from '../lib/Head/types';
import moment from 'moment';
import { hotelReservations } from './testdata';
import { Reservation } from '../lib/types';
import { formatToDate } from '../lib/helpers';

const reservationItems = [
  { name: 'Single', number: 1, background: '#D6C7A1' },
  { name: 'Single', number: 2, background: '#D6C7A1' },
  { name: 'Double', number: 3, background: '#FFA25B' },
  { name: 'Double', number: 4, background: '#FFA25B' },
  { name: 'Double', number: 5, background: '#FFA25B' },
  { name: 'Presidential', number: 6, background: '#F07966' },
  { name: 'Double', number: 7, background: '#FFA25B' },
  { name: 'Double', number: 8, background: '#FFA25B' },
  { name: 'Single', number: 9, background: '#D6C7A1' },
  { name: 'Single', number: 10, background: '#D6C7A1' },
  { name: 'Single', number: 11, background: '#D6C7A1' }
];

const now = new Date();
const HeaderCell: FC<HeaderCellProps> = ({ date, locale }) => {
  const weekDay = date.getDay();
  const isWeekend = weekDay === 0 || weekDay === 6;
  const isToday = moment(date).isSame(now, 'day');

  return (
    <div
      style={{
        height: '100%',
        textAlign: 'center',
        backgroundColor: isToday ? 'hsla(213, 79%, 47%, 1)' : isWeekend ? '#e4e8e9' : '#fff',
        color: isToday ? 'white' : 'black'
      }}
    >
      <div>{date.toLocaleDateString(locale, { weekday: 'short' })}</div>
      <strong>{date.toLocaleDateString(locale, { day: 'numeric' })}</strong>
    </div>
  );
};

const App: FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(hotelReservations);
  const [width, setWidth] = useState(45);

  return (
    <>
      <button type="button" onClick={() => setWidth((prev) => prev - 10)}>
        -
      </button>
      <button type="button" onClick={() => setWidth((prev) => prev + 10)}>
        +
      </button>
      <button
        type="button"
        onClick={() =>
          setReservations((prev) =>
            prev.map((r) => ({
              ...r,
              end: formatToDate(new Date())
            }))
          )
        }
      >
        inc
      </button>
      <Reserver
        value={reservations}
        onChange={setReservations}
        dimension={{ width, height: 45 }}
        reservationItems={reservationItems}
        headerHeight={68}
        slotComponents={{
          HeaderCell
        }}
      />
    </>
  );
};

export default App;
