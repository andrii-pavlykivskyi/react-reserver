import React, { useEffect } from 'react';
import Head from '../Head';
import Cell from '../Cell';
import { ReserverProps, GetReserverContent } from './types';
import useStyle from '../hooks/useStyle';

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
      isDragging = false,

      children,
      HeadProps,
      BodyCellProps,
      ...props
    },
    ref
  ) => {
    const setStyle = useStyle(`
    .reserver-cell:hover > div {
      background: #e4e8e9 !important;
    }  
    .peg-drop-place {
      position: relative;
    }
    .peg-drop-place::after {
      content: '';
      inset: 0px;
      background-color: #0e6ba830;
      z-index: 20000;
      position: absolute;
    }
    `);

    useEffect(() => {
      setStyle(`
      .peg-drop-place-first::after {
        border-bottom-left-radius: ${dimension.height}px;
        border-top-left-radius: ${dimension.height}px;
      }
      .peg-drop-place-last::after {
        border-bottom-right-radius: ${dimension.height}px;
        border-top-right-radius: ${dimension.height}px;
      }
      `);
    }, [dimension, setStyle]);

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
        {...props}
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
                  isHeading
                  className={props.rowTitleClassName}
                >
                  {rowTitles[r]}
                </Cell>
              )}
              {[...Array(columnCount)].map((_, c) => {
                return (
                  <Cell
                    {...BodyCellProps}
                    key={`r${r}c${c}`}
                    dimension={dimension}
                    className={props.cellClassName}
                    column={c}
                    row={r}
                    isDragging={isDragging}
                    isHeading={false}
                  >
                    {content[`r${r}c${c}`]}
                  </Cell>
                );
              })}
              {dir === 'rtl' && (
                <Cell
                  column={-1}
                  row={r}
                  isHeading
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
