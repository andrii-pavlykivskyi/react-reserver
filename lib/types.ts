export type Dimension = {
  width: number;
  height: number;
};

export type Position = {
  left: number;
  top: number;
};

export type CellCoordinates = { row: number; column: number };

export type BarStick = 'right' | 'left';

export type Reservation = {
  id: string;
  start: string;
  end: string;
  name: string;
  row: number;
  column?: number;
  length?: number;
  dimension?: Dimension;
};
