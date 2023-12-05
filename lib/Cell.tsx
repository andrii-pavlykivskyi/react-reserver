import { CellCoordinates, Dimension } from './types';

type EventParam = {
  cell: CellCoordinates;
  dimension: Dimension;
};

export type CellEventHandler = (p: EventParam, e: React.MouseEvent<Element>) => void;

export type CellPointerEventHandler = (p: EventParam, e: React.PointerEvent<Element>) => void;

export type CellProps = {
  dimension: Dimension;
  className?: string;
  column: number;
  row: number;
  style?: React.CSSProperties;
  onDragOver?: CellEventHandler;
  onMouseOver?: CellEventHandler;
  onMouseUp?: CellEventHandler;
  onDrop?: CellEventHandler;
  onMouseEnter?: CellEventHandler;
  onPointerEnter?: CellPointerEventHandler;
  onPointerLeave?: CellPointerEventHandler;
  onPointerMove?: CellPointerEventHandler;
  onPointerOut?: CellPointerEventHandler;
  onPointerOver?: CellPointerEventHandler;
  onMouseDown?: CellEventHandler;
  onPointerDown?: CellPointerEventHandler;
  onPointerUp?: CellPointerEventHandler;
} & React.PropsWithChildren;

export default function Cell({
  dimension,
  children,
  className,
  column,
  onDragOver,
  onDrop,
  onMouseDown,
  onMouseEnter,
  onMouseOver,
  onMouseUp,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  onPointerOut,
  onPointerOver,
  onPointerUp,
  row,
  style
}: CellProps) {
  return (
    <div
      role="gridcell"
      aria-colindex={column}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver &&
          onDragOver(
            {
              dimension: dimension,
              cell: { row, column }
            },
            e
          );
      }}
      className={className}
      onMouseOver={(e) => {
        onMouseOver &&
          onMouseOver(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onMouseEnter={(e) => {
        onMouseEnter &&
          onMouseEnter(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerEnter={(e) => {
        onPointerEnter &&
          onPointerEnter(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerLeave={(e) => {
        onPointerLeave &&
          onPointerLeave(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerMove={(e) => {
        onPointerMove &&
          onPointerMove(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerOut={(e) => {
        onPointerOut &&
          onPointerOut(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerOver={(e) => {
        onPointerOver &&
          onPointerOver(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onMouseDown={(e) => {
        onMouseDown &&
          onMouseDown(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerDown={(e) => {
        onPointerDown &&
          onPointerDown(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onPointerUp={(e) => {
        onPointerUp &&
          onPointerUp(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onMouseUp={(e) => {
        onMouseUp &&
          onMouseUp(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      onDrop={(e) => {
        onDrop &&
          onDrop(
            {
              dimension: dimension,
              cell: { row: row, column: column }
            },
            e
          );
      }}
      style={{
        overflow: 'hidden',
        width: dimension.width,
        height: dimension.height,
        ...style
      }}
    >
      {children}
    </div>
  );
}
