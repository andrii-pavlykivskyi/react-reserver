import { ReactNode } from 'react';
import { StateBar } from '../reserverReducer';
import { BarStick } from '../types';

export type DraggingElement =
  | (StateBar & {
      draggingLeft?: number;
      draggingTop?: number;
      selectedCell?: number;
      moving?: boolean;
      stick?: BarStick;
    })
  | null;

export type SelectedColumns = Record<number, boolean>;

export type ReservationItem = {
  name: ReactNode;
  background: string;
  number: number;
};

export type ReserverProps = {
  reservationItems: ReservationItem[];
};
