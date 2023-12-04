import React, { useMemo } from 'react'
import { getColumnCount, getRowCount } from '../helpers'
import Head from '../Head'
import Cell from '../Cell'
import { ReserverProps, GetReserverContent } from './types'

/* TODO:
Test accessibility
*/

const Reserver = React.forwardRef<HTMLDivElement, ReserverProps>(
  (
    {
      dimension = { height: 20, width: 20 },
      height = 500,
      width = 500,

      columnTitles: getColumnTitles = [],
      rowTitles: getRowTitles = [],
      content: getContent = (() => ({})) as GetReserverContent,
      rowTitleWidth = 0,
      columnTitleHeight = 0,
      dir = 'ltr',

      children,
      ...props
    },
    ref
  ) => {
    const rowCount = useMemo(
      () => getRowCount(dimension, height),
      [dimension, height]
    )
    const columnCount = useMemo(
      () => getColumnCount(dimension, width, rowTitleWidth),
      [dimension, rowTitleWidth, width]
    )

    const rowTitles = getRowTitles.map((getRowTitle) =>
      typeof getRowTitle === 'function' ? getRowTitle(rowCount) : getRowTitle
    )
    const columnTitles = getColumnTitles.map((getColumnTitle) =>
      typeof getColumnTitle === 'function'
        ? getColumnTitle(rowCount)
        : getColumnTitle
    )
    const content = getContent(columnCount, rowCount)

    console.log(columnCount);
    
    return (
      <div
        ref={ref}
        id={props.id}
        className={props.className}
        role='grid'
        style={{ ...props.style, position: 'relative' }}
      >
        <Head
          columnTitles={columnTitles}
          columnCount={columnCount}
          height={columnTitleHeight}
          rowTitleWidth={rowTitleWidth}
          dimension={dimension}
          isVisible={columnTitles.length > 0}
          columnTitleClassName={props.columnTitleClassName}
          dir={dir}
          cantonClassName={props.cantonClassName}
        />
        {[...Array(rowCount)].map((_, r) => {
          return (
            <div
              role='rowgroup'
              key={r}
              style={{ height: dimension.height, display: 'flex' }}
            >
              {dir === 'ltr' && (
                <Cell
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
                )
              })}
              {dir === 'rtl' && (
                <Cell
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
          )
        })}

        <div role='list'>
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
    )
  }
)

export default Reserver
