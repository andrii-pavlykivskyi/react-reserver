import { CellCoordinates, Dimension } from '../types';

type EventParam = {
  cell: CellCoordinates;
  date: Date;
  dimension: Dimension;
};

export type BodyCellEventHandler = (p: EventParam, e: React.MouseEvent<Element>) => void;

export type BodyCellPointerEventHandler = (p: EventParam, e: React.PointerEvent<Element>) => void;

export type BodyCellProps = {
  dimension: Dimension;
  column: number;
  row: number;
  date: Date;
  isHeading: boolean;
  className?: string;
  style?: React.CSSProperties;
  isDragging?: boolean;
  isResizing?: boolean;
  onDragOver?: BodyCellEventHandler;
  onMouseOver?: BodyCellEventHandler;
  onMouseUp?: BodyCellEventHandler;
  onDrop?: BodyCellEventHandler;
  onMouseEnter?: BodyCellEventHandler;
  onPointerEnter?: BodyCellPointerEventHandler;
  onPointerLeave?: BodyCellPointerEventHandler;
  onPointerMove?: BodyCellPointerEventHandler;
  onPointerOut?: BodyCellPointerEventHandler;
  onPointerOver?: BodyCellPointerEventHandler;
  onMouseDown?: BodyCellEventHandler;
  onPointerDown?: BodyCellPointerEventHandler;
  onPointerUp?: BodyCellPointerEventHandler;
} & React.PropsWithChildren;
