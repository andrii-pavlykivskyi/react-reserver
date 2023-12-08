import { FC, Dispatch, ReactNode, SetStateAction } from 'react';
import { StateBar, BarStick, Dimension, Reservation } from '../types';
import { HeaderCellProps } from '../Head/types';

export type ReserverSlotComponents = {
  HeaderCell?: FC<HeaderCellProps>;
};

export type EditingElement = StateBar & {
  draggingLeft?: number;
  draggingTop?: number;
  selectedCell: number;
  moving: boolean;
  editing: boolean;
  stick: BarStick;
};

export type SelectedColumns = Record<number, boolean>;

export type ReservationItem = {
  name: ReactNode;
  background: string;
  number: number;
};

export type ReserverProps = {
  reservationItems: ReservationItem[];
  value: Reservation[];
  onChange: Dispatch<SetStateAction<Reservation[]>>;
  dimension?: Dimension;
  slotComponents?: ReserverSlotComponents;
  headerHeight?: number;
};
