import React, { useEffect, useMemo, useRef, useState } from 'react';
import Reserver, {
  Bar,
  useReserver,
  reserverReducer,
  createBar,
  getPosition,
  Peg,
  Tag,
  evaluatePosition
} from '../lib/main';
import './index.css';
import clsx from 'clsx';

import moment from 'moment';
import { isObjectEmpty, resolveDateDiff, dateRange } from './helpers';
import { hotelReservations } from './testdata';
import { BarStick } from '../lib/types';
import { StateBar } from '../lib/reserverReducer';
import useStyle from './../lib/hooks/useStyle';
import { hasCollisions } from './../lib/collision';
import { CellEventHandler } from '../lib/Cell';

type DraggingElement =
  | (StateBar & {
      draggingLeft?: number;
      draggingTop?: number;
      selectedCell?: number;
      moving?: boolean;
      stick?: BarStick;
    })
  | null;

export type SelectedColumns = Record<number, boolean>;

function generateColumnTitles(props: {
  date: string;
  columnCount: number;
  selectedColumns: SelectedColumns;
}) {
  return dateRange(props.date, props.columnCount, 'days').map((val, index) => {
    return (
      <div
        key={val}
        style={{
          background: props.selectedColumns[index] ? '#1ca3f9' : '#fff',
          height: '100%',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontWeight: 500
        }}
      >
        <div>{val}</div>
      </div>
    );
  });
}

function generateRowTitles(dropRowIndex: number | null) {
  return [
    { name: 'Single', number: 1, background: '#D6C7A1' },
    { name: 'Single', number: 2, background: '#D6C7A1' },
    { name: 'Double', number: 3, background: '#FFA25B' },
    { name: 'Double', number: 4, background: '#FFA25B' },
    { name: 'Double', number: 5, background: '#FFA25B' },
    { name: 'Presidential', number: 6, background: '#F07966' },
    { name: 'Double', number: 7, background: '#FFA25B' },
    { name: 'Double', number: 8, background: '#FFA25B' },
    { name: 'Single', number: 9, background: '#D6C7A1' },
    { name: 'Single', number: 10, background: '#D6C7A1' },
    { name: 'Single', number: 11, background: '#D6C7A1' },
    { name: 'Single', number: 12, background: '#D6C7A1' },
    { name: 'Double', number: 13, background: '#FFA25B' },
    { name: 'Double', number: 14, background: '#FFA25B' },
    { name: 'Single', number: 15, background: '#D6C7A1' },
    { name: 'Queen', number: 16, background: '#7ED3B2' }
  ].map((room, index) => {
    return (
      <div>
        <div
          style={{
            padding: '3px',
            display: 'flex',
            alignContent: 'center',
            background: dropRowIndex === index ? '#1ca3f9' : room.background
          }}
        >
          <div style={{ fontSize: '13px', marginRight: '10px' }}>{room.number}</div>
          <div>{room.name}</div>
        </div>
      </div>
    );
  });
}

function calculateLinePoint(
  column: number,
  columnWidth: number,
  columnTitleHeight: number,
  row: number,
  rowHeight: number,
  rowTitleWidth: number
) {
  return {
    x: column * columnWidth + rowTitleWidth,
    y: (row + 0.5) * rowHeight + columnTitleHeight
  };
}

const cellDimension = { width: 40, height: 30 };
const startDate = moment.utc(moment.now());

export default function HotelReservation() {
  const { bars, isEditing, setIsEditing, addBar, setBars, editBar } = useReserver(
    reserverReducer,
    []
  );

  const windowRef = useRef<HTMLDivElement>(null);
  const columnTitleHeight = 30;
  const rowTitleWidth = 130;

  const daysTotal = 30;
  const [newReservation, setNewReservation] = useState<StateBar | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isColliding, setIsColliding] = useState(false);

  const [draggingElement, setDraggingElement] = useState<DraggingElement>(null);

  const hoverRow = draggingElement ? draggingElement.row : null;
  const selectedColumns = useMemo(() => {
    const selectionRange = {};
    if (!draggingElement) {
      return selectionRange;
    }
    [...Array(draggingElement.length)].forEach((na, i) => {
      selectionRange[i + draggingElement.column] = true;
    });
    return selectionRange;
  }, [draggingElement]);

  const setStyle = useStyle();

  useEffect(() => {
    const nBars = hotelReservations.map((bar) => {
      bar.dimension = cellDimension;
      if (bar.start && bar.end) {
        bar.length = resolveDateDiff(bar.start, bar.end) + 1;
      }

      if (bar.start && bar.end) {
        bar.column = resolveDateDiff(startDate, bar.start) + 1;
      }

      return bar;
    });

    setBars(nBars);
  }, [setBars]);

  const reserverWidth = windowRef.current?.getBoundingClientRect().width || 0;

  const handleDropBarOnCell: CellEventHandler = ({ cell }, e) => {
    e.currentTarget.releasePointerCapture((e as unknown as { pointerId: number }).pointerId);

    if (isDragging && !isEditing && draggingElement && draggingElement.selectedCell !== undefined) {
      const bar: StateBar = {
        ...draggingElement,
        row: isColliding ? draggingElement.row : cell.row,
        column: isColliding
          ? draggingElement.column
          : (cell?.column || 0) - draggingElement.selectedCell,
        moving: false
      };

      editBar(bar);

      setStyle(`.reserver-drag{transform: translate(0px,0px)}`);
      setIsDragging(false);
      setDraggingElement(null);
      setIsColliding(false);
    }

    if (isEditing) {
      const bar = bars.find((bar) => {
        return bar.editing;
      });
      if (!isObjectEmpty(newReservation)) {
        setNewReservation(bar || null);
        // toggleAddReservation()
      }
      if (bar) {
        editBar({ ...bar, editing: false });
      }
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          cursor: isColliding ? 'not-allowed' : isDragging ? 'grabbing' : 'unset'
        }}
      >
        <div
          ref={windowRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 500
          }}
        >
          {reserverWidth ? (
            <Reserver
              columnTitleHeight={columnTitleHeight}
              dimension={cellDimension}
              rowTitleWidth={rowTitleWidth}
              isDragging={isDragging}
              rowTitles={generateRowTitles(hoverRow)}
              columnTitles={generateColumnTitles({
                date: startDate.toISOString(),
                columnCount: daysTotal,
                selectedColumns: selectedColumns
              })}
              content={(columnCount, rowCount) => {
                const content = {};

                Array(rowCount)
                  .fill(null)
                  .forEach((_, r) => {
                    Array(columnCount)
                      .fill(null)
                      .forEach((_, c) => {
                        const isDropPlace = isDragging && selectedColumns[c] && hoverRow === r;

                        const dropColumnsIndexes = Object.entries(selectedColumns)
                          .filter(([, value]) => !!value)
                          .sort(([a], [b]) => +a - +b)
                          .map(([v]) => +v);
                        const isFirstDropPlace = isDropPlace && dropColumnsIndexes.at(0) === c;
                        const isLastDropPlace = isDropPlace && dropColumnsIndexes.at(-1) === c;

                        content[`r${r}c${c}`] = (
                          <Peg
                            className={clsx({
                              'peg-drop-place': isDropPlace,
                              'peg-drop-place-first': isFirstDropPlace,
                              'peg-drop-place-last': isLastDropPlace
                            })}
                            style={{
                              background: c % 2 == 0 ? '#EDF1F2' : '#F6F8F9'
                            }}
                          />
                        );
                      });
                  });

                return content;
              }}
              onPointerLeave={(e) =>
                draggingElement &&
                draggingElement.selectedCell !== undefined &&
                handleDropBarOnCell(
                  {
                    cell: {
                      column: draggingElement.column + draggingElement.selectedCell,
                      row: draggingElement?.row
                    },
                    dimension: cellDimension
                  },
                  e
                )
              }
              BodyCellProps={{
                onPointerDown: (props, e) => {
                  if (isDragging) {
                    handleDropBarOnCell(props, e);
                    return;
                  }
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  const newbar = createBar(props.dimension, props.cell, {
                    new: true
                  });

                  setNewReservation(newbar);
                  addBar(newbar);
                  setDraggingElement(newbar);
                  setIsEditing(true);
                },
                isResizing: isEditing,
                onPointerEnter: (props, e) => {
                  e.currentTarget.releasePointerCapture(e.pointerId);

                  if (isDragging && !isEditing && draggingElement) {
                    const newColumnValue = props.cell.column - (draggingElement.selectedCell || 0);

                    const collision = hasCollisions(
                      {
                        ...draggingElement,
                        row: props.cell.row || draggingElement.row,
                        column: newColumnValue
                      },
                      bars.filter((b) => b.id !== draggingElement.id)
                    );
                    setDraggingElement((prev) => {
                      if (!prev) {
                        return null;
                      }
                      return {
                        ...prev,
                        column: collision ? prev.column : newColumnValue,
                        row: collision ? prev?.row : props.cell.row
                      };
                    });
                    setIsColliding(collision);
                  }

                  if (isEditing) {
                    setDraggingElement((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      const evaluatedBar = evaluatePosition(prev, props.cell);

                      const collision = hasCollisions(
                        evaluatedBar,
                        bars.filter((b) => b.id !== evaluatedBar.id)
                      );

                      if (collision) {
                        editBar(prev);
                        return prev;
                      }
                      if (evaluatedBar) {
                        editBar(evaluatedBar);
                      }
                      return evaluatedBar;
                    });
                  }
                },
                onPointerUp: handleDropBarOnCell
              }}
              onPointerMove={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);

                if (isDragging && !isEditing && draggingElement) {
                  setStyle(
                    `.reserver-drag{transform: translate(${
                      e.pageX - (draggingElement.draggingLeft || 0)
                    }px,${e.pageY - (draggingElement.draggingTop || 0)}px); scale: 103%; }`
                  );
                }
              }}
            >
              {({ columnTitleHeight, rowTitleWidth }) => {
                return (
                  <>
                    {bars.map((bar) => {
                      return (
                        <Bar
                          id={bar.id}
                          draggable
                          length={bar.length}
                          dimension={bar.dimension}
                          style={{
                            ...(bar as unknown as { style: React.CSSProperties }).style,
                            borderRadius: bar.dimension.height / 2,

                            pointerEvents:
                              bar.editing || bar.moving || isColliding || isDragging || isEditing
                                ? 'none'
                                : 'auto',
                            zIndex: isDragging && draggingElement?.id === bar.id ? 1001 : 1000,
                            scale: isEditing && draggingElement?.id === bar.id ? '103%' : undefined,
                            transition: '.15s ease-in-out scale',
                            cursor:
                              isDragging && draggingElement?.id !== bar.id ? 'not-allowed' : 'grab',
                            ...getPosition(
                              bar.row,
                              bar.column,
                              bar.dimension,
                              rowTitleWidth,
                              columnTitleHeight
                            )
                          }}
                          onPointerDown={(e) => {
                            e.currentTarget.releasePointerCapture(e.pointerId);
                            if (isEditing) {
                              e.preventDefault();

                              return;
                            }

                            const target = e.currentTarget.getBoundingClientRect();

                            const relativeX = e.pageX - target.left;
                            const relativeY = e.pageY - target.top;

                            const selectedCell = parseInt(`${relativeX / bar.dimension.width}`);

                            const element: DraggingElement = {
                              ...bar,
                              selectedCell: selectedCell,
                              moving: true,
                              draggingLeft: e.pageX,
                              draggingTop: e.pageY,
                              stick: 'left'
                            };

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const exceptionObject: any = {};

                            exceptionObject.barEnd = {
                              x: bar.dimension.width * bar.length - relativeX,
                              y: bar.dimension.height - bar.dimension.height * 0.5 - relativeY
                            };

                            exceptionObject.barStart = {
                              x: relativeX,
                              y: relativeY - bar.dimension.height * 0.5
                            };

                            if (bar.to) {
                              const toBarIndex = bars.findIndex((b) => {
                                return b.id === bar.to;
                              });
                              const toBar = bars[toBarIndex];
                              if (toBarIndex > -1) {
                                exceptionObject.to = calculateLinePoint(
                                  toBar.column,
                                  toBar.dimension.width,
                                  columnTitleHeight,
                                  toBar.row,
                                  toBar.dimension.height,
                                  rowTitleWidth
                                );
                              }
                            }
                            if (bar.from) {
                              const fromBarIndex = bars.findIndex((b) => {
                                return b.id === bar.from;
                              });
                              const fromBar = bars[fromBarIndex];
                              exceptionObject['from' + fromBar.id] = fromBar.id;
                              if (
                                fromBarIndex > -1 &&
                                fromBar.column !== undefined &&
                                fromBar.row !== undefined
                              ) {
                                const location = calculateLinePoint(
                                  fromBar.column,
                                  fromBar.dimension.width,
                                  columnTitleHeight,
                                  fromBar.row,
                                  fromBar.dimension.height,
                                  rowTitleWidth
                                );
                                exceptionObject.from = {
                                  x: fromBar.dimension.width * fromBar.length + location.x,
                                  y: location.y
                                };
                              }
                            }

                            editBar(element);
                            setDraggingElement(element);
                            setIsDragging(true);
                          }}
                          key={bar.id}
                          className={bar.moving ? 'reserver-drag' : ''}
                          lastContent={
                            <div
                              style={{
                                zIndex: 10000,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                              }}
                            >
                              <div
                                role="button"
                                style={{
                                  marginRight: '3px',
                                  height: '20px',
                                  width: '20px',
                                  cursor: isDragging ? '' : 'e-resize'
                                }}
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  e.currentTarget.releasePointerCapture(e.pointerId);
                                  const resizedBar: DraggingElement = {
                                    ...bar,
                                    stick: 'left',
                                    editing: true
                                  };
                                  setDraggingElement(resizedBar);
                                  editBar(resizedBar);
                                  setIsEditing(true);
                                }}
                                // src="/dragicon.png"
                              />
                            </div>
                          }
                          firstContent={
                            <div
                              style={{
                                zIndex: 10000,
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                              }}
                            >
                              <div
                                role="button"
                                style={{
                                  marginLeft: '3px',
                                  height: '20px',
                                  width: '20px',
                                  cursor: isDragging ? '' : 'e-resize'
                                }}
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  e.currentTarget.releasePointerCapture(e.pointerId);
                                  const newbar: DraggingElement = {
                                    ...bar,
                                    stick: 'right',
                                    editing: true
                                  };
                                  editBar(newbar);
                                  setDraggingElement(newbar);
                                  setIsEditing(true);
                                }}
                                // src="/dragicon.png"
                              />
                            </div>
                          }
                        >
                          <Tag
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              overflow: 'hidden',
                              color: '#fff',
                              borderRadius: '6px',
                              width: bar.length * bar.dimension.width - 32,
                              marginLeft: '14px',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {bar.name}
                          </Tag>
                        </Bar>
                      );
                    })}
                  </>
                );
              }}
            </Reserver>
          ) : null}
        </div>
      </div>
      {/* <Modali.Modal {...addReservationModal}>
        <div style={{ marginLeft: '20px', padding: '2px' }}>
          <div />
          <div>
            Name:
            <input
              type='text'
              value={guestName}
              onChange={(event) => {
                setGuestName(event.target.value)
              }}
            />
          </div>
        </div>
      </Modali.Modal> */}
    </>
  );
}
