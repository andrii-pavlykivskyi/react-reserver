import { FC, useEffect, useMemo } from 'react';
import Head from '../Head/Head';
import Cell from '../Cell';
import { GridProps, GetGridContent } from './types';
import useStyle from '../hooks/useStyle';
import { ROOT_CLASS_NAME } from '../constants';
import BodyCell from '../BodyCell';

const Grid: FC<GridProps> = ({
  dimension,
  rowTitles,
  content: getContent = (() => ({})) as GetGridContent,
  rowTitleWidth = 0,
  dir = 'ltr',
  isDragging = false,

  children,
  HeadProps,
  BodyCellProps,
  slotComponents,
  ...props
}) => {
  const setStyle = useStyle(`
    .${ROOT_CLASS_NAME} .reserver-cell:hover > div {
      background: #e4e8e9 !important;
    }  
    .${ROOT_CLASS_NAME} .peg-drop-place {
      position: relative;
    }
    .${ROOT_CLASS_NAME} .peg-drop-place::after {
      content: '';
      inset: 0px;
      background-color: #0e6ba830;
      z-index: 20000;
      position: absolute;
    }
    .${ROOT_CLASS_NAME} {
      display: flex;
      flex-direction: column;
      justify-content: center;
      touch-action: none;
      user-select: none;
    }
    .${ROOT_CLASS_NAME} > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 500px;
    }
    `);

  useEffect(() => {
    setStyle(`
      .${ROOT_CLASS_NAME} .peg-drop-place-first::after {
        border-bottom-left-radius: ${dimension.height}px;
        border-top-left-radius: ${dimension.height}px;
      }
      .${ROOT_CLASS_NAME} .peg-drop-place-last::after {
        border-bottom-right-radius: ${dimension.height}px;
        border-top-right-radius: ${dimension.height}px;
      }
      .${ROOT_CLASS_NAME} .bar > div {
        width: ${dimension.width}px;
        height: ${dimension.width}px;
      }
      `);
  }, [dimension, setStyle]);

  const columnDates = HeadProps.columnDates;
  const columnCount = (columnDates || []).length;
  const rowCount = (rowTitles || []).length;

  const content = getContent(columnCount, rowCount);

  const minWidth = rowTitleWidth + columnCount * dimension.width;

  const childrenContent = useMemo(
    () =>
      typeof children === 'function'
        ? children({
            rowCount: rowCount,
            columnCount: columnCount,
            rowTitleWidth: rowTitleWidth,
            dimension: dimension
          })
        : null,
    [children, columnCount, dimension, rowCount, rowTitleWidth]
  );

  const head = useMemo(
    () => (
      <Head
        isVisible={columnCount > 0}
        {...HeadProps}
        columnCount={columnCount}
        rowTitleWidth={rowTitleWidth}
        dimension={dimension}
        columnTitleClassName={props.columnTitleClassName}
        cantonClassName={props.cantonClassName}
        slotComponents={slotComponents}
        dir={dir}
      />
    ),
    [
      HeadProps,
      columnCount,
      dimension,
      dir,
      props.cantonClassName,
      props.columnTitleClassName,
      rowTitleWidth,
      slotComponents
    ]
  );
  const grid = useMemo(
    () =>
      [...Array(rowCount)].map((_, r) => {
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
                <BodyCell
                  {...BodyCellProps}
                  key={`r${r}c${c}`}
                  dimension={dimension}
                  className={props.cellClassName}
                  column={c}
                  row={r}
                  date={columnDates[c]}
                  isDragging={isDragging}
                  isHeading={false}
                >
                  {content[`r${r}c${c}`]}
                </BodyCell>
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
      }),
    [
      BodyCellProps,
      columnCount,
      columnDates,
      content,
      dimension,
      dir,
      isDragging,
      props.cellClassName,
      props.rowTitleClassName,
      rowCount,
      rowTitleWidth,
      rowTitles
    ]
  );

  return (
    <div
      id={props.id}
      className={props.className}
      role="grid"
      {...props}
      style={{ ...props.style, position: 'relative', minWidth }}
    >
      {head}
      {grid}
      <div role="list" style={{ height: '100%', overflow: 'hidden' }}>
        {childrenContent}
        {Array.isArray(children) && children}
      </div>
    </div>
  );
};

export default Grid;
