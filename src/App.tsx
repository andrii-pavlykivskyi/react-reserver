import React, { FC } from 'react';
import Reserver from './../lib/main';
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
  { name: 'Single', number: 11, background: '#D6C7A1' },
  { name: 'Single', number: 12, background: '#D6C7A1' },
  { name: 'Double', number: 13, background: '#FFA25B' },
  { name: 'Double', number: 14, background: '#FFA25B' },
  { name: 'Single', number: 15, background: '#D6C7A1' },
  { name: 'Queen', number: 16, background: '#7ED3B2' }
]

const App: FC = () => {


  return (
    <>
      <Reserver reservationItems={reservationItems} />
    </>
  );
};

export default App;
