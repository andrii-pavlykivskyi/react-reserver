/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, Dispatch, SetStateAction } from 'react';
import actionTypes, { ActionType } from './actionTypes';
import { reserverReducer } from './reserverReducer';
import { Reservation, StateBar } from './types';
import { useState } from 'react';
import { resolveDateDiff } from './Reserver/helpers';

type UseReserverOptions = {
  initialReservations: Reservation[];
  onChange: Dispatch<SetStateAction<Reservation[]>>;
  startDate: string | moment.Moment;
};

function useReserver({ initialReservations, onChange, startDate }: UseReserverOptions) {
  const [barsState, setBarsState] = useState<StateBar[]>(
    initialReservations.map((reservation) => {
      return {
        ...reservation,
        stick: 'left',
        editing: false,
        moving: false,
        column: resolveDateDiff(startDate, reservation.start),
        length: resolveDateDiff(reservation.start, reservation.end)
      } satisfies StateBar;
    })
  );
  const action = useCallback(
    (type: ActionType, payload: any) => {
      let reservations: Reservation[] = [];
      setBarsState((prev) => {
        const newState = reserverReducer({ bars: prev }, { type, payload });
        reservations = newState.bars.map((b) => ({
          end: b.end,
          id: b.id,
          name: b.name,
          row: b.row,
          start: b.start
        }));
        return newState.bars;
      });
      setTimeout(() => {
        onChange(reservations);
      }, 0);
    },
    [onChange]
  );

  const addBar = useCallback((bar: StateBar) => action(actionTypes.add, bar), [action]);

  const editBar = useCallback((bar: StateBar) => action(actionTypes.edit, bar), [action]);

  const deleteBar = useCallback((bar: StateBar) => action(actionTypes.delete, bar), [action]);

  const setBars = useCallback((bars: StateBar[]) => action(actionTypes.setBars, bars), [action]);

  return {
    bars: barsState,
    addBar,
    editBar,
    deleteBar,
    setBars
  };
}
export default useReserver;
