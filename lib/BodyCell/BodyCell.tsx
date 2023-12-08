import clsx from 'clsx';
import { BodyCellProps } from './types';

function BodyCell({
  dimension,
  children,
  className,
  column,
  isHeading,
  row,
  date,
  style,
  isDragging,
  isResizing = false,
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
  onPointerUp
}: BodyCellProps) {
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
              cell: { row, column },
              date
            },
            e
          );
      }}
      className={clsx(className, 'reserver-cell')}
      onMouseOver={(e) => {
        onMouseOver &&
          onMouseOver(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onMouseEnter={(e) => {
        onMouseEnter &&
          onMouseEnter(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerEnter={(e) => {
        onPointerEnter &&
          onPointerEnter(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerLeave={(e) => {
        onPointerLeave &&
          onPointerLeave(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerMove={(e) => {
        onPointerMove &&
          onPointerMove(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerOut={(e) => {
        onPointerOut &&
          onPointerOut(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerOver={(e) => {
        onPointerOver &&
          onPointerOver(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onMouseDown={(e) => {
        onMouseDown &&
          onMouseDown(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerDown={(e) => {
        onPointerDown &&
          onPointerDown(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onPointerUp={(e) => {
        onPointerUp &&
          onPointerUp(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onMouseUp={(e) => {
        onMouseUp &&
          onMouseUp(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      onDrop={(e) => {
        onDrop &&
          onDrop(
            {
              dimension: dimension,
              cell: { row: row, column: column },
              date
            },
            e
          );
      }}
      style={{
        overflow: 'hidden',
        width: dimension.width,
        height: dimension.height,
        cursor: isHeading
          ? 'unset'
          : isDragging
          ? 'grabbing'
          : isResizing
          ? 'e-resize'
          : 'crosshair',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default BodyCell;
