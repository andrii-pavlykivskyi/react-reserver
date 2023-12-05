import React from 'react';
import Head from '../Head';
import Cell from '../Cell';
import { ReserverProps, GetReserverContent } from './types';

const Reserver = React.forwardRef<HTMLDivElement, ReserverProps>(
  (
    {
      dimension = { height: 20, width: 20 },
      columnTitles,
      rowTitles,
      content: getContent = (() => ({})) as GetReserverContent,
      rowTitleWidth = 0,
      columnTitleHeight = 0,
      dir = 'ltr',

      children,
      HeadProps,
      ...props
    },
    ref
  ) => {
    const columnCount = (columnTitles || []).length;
    const rowCount = (rowTitles || []).length;

    const content = getContent(columnCount, rowCount);

    const minWidth = rowTitleWidth + columnCount * dimension.width;

    return (
      <div
        ref={ref}
        id={props.id}
        className={props.className}
        role="grid"
        style={{ ...props.style, position: 'relative', minWidth }}
      >
        <Head
          columnTitles={columnTitles}
          isVisible={columnTitles.length > 0}
          {...HeadProps}
          columnCount={columnCount}
          height={columnTitleHeight}
          rowTitleWidth={rowTitleWidth}
          dimension={dimension}
          columnTitleClassName={props.columnTitleClassName}
          cantonClassName={props.cantonClassName}
          dir={dir}
        />
        {[...Array(rowCount)].map((_, r) => {
          return (
            <div role="rowgroup" key={r} style={{ height: dimension.height, display: 'flex' }}>
              {dir === 'ltr' && (
                <Cell
                  column={-1}
                  row={r}
                  style={{ display: rowTitles.length > 0 ? 'initial' : 'none' }}
                  dimension={{
                    height: dimension.height,
                    width: rowTitleWidth
                  }}
                  className={props.rowTitleClassName}
                >
                  {rowTitles[r]}
                </Cell>
              )}
              {[...Array(columnCount)].map((_, c) => {
                return (
                  <Cell
                    key={`r${r}c${c}`}
                    onMouseDown={props.mouseDownCell}
                    onMouseEnter={props.mouseEnterCell}
                    onMouseUp={props.mouseUpCell}
                    onDrop={props.mouseDropCell}
                    onDragOver={props.mouseDragOverCell}
                    onPointerDown={props.pointerDownCell}
                    onPointerMove={props.pointerMoveCell}
                    onPointerEnter={props.pointerEnterCell}
                    onPointerLeave={props.pointerLeaveCell}
                    onPointerUp={props.pointerUpCell}
                    onPointerOver={props.pointerOverCell}
                    dimension={dimension}
                    className={props.cellClassName}
                    column={c}
                    row={r}
                  >
                    {content[`r${r}c${c}`]}
                  </Cell>
                );
              })}
              {dir === 'rtl' && (
                <Cell
                  column={-1}
                  row={r}
                  style={{ display: rowTitles.length > 0 ? 'initial' : 'none' }}
                  dimension={{
                    height: dimension.height,
                    width: rowTitleWidth
                  }}
                  className={props.rowTitleClassName}
                >
                  {rowTitles[r]}
                </Cell>
              )}
            </div>
          );
        })}

        <div role="list" style={{ height: '100%', overflow: 'hidden' }}>
          {typeof children === 'function' &&
            children({
              rowCount: rowCount,
              columnCount: columnCount,
              rowTitleWidth: rowTitleWidth,
              dimension: dimension,
              columnTitleHeight:
                columnTitles.length > 0
                  ? columnTitleHeight > 0
                    ? columnTitleHeight
                    : dimension.height
                  : 0
            })}
          {Array.isArray(children) && children}
        </div>
      </div>
    );
  }
);

export default Reserver;
