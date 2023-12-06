import React, { useEffect, useRef, useState } from 'react';
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
import { BarStick, TBar } from '../lib/types';
import { StateBar } from '../lib/reserverReducer';
import useStyle from './../lib/hooks/useStyle';

type DraggingElement =
  | (TBar & {
      draggingLeft?: number;
      draggingTop?: number;
      selectedCell?: number;
      moving?: boolean;
      stick?: BarStick;
    })
  | null;

export type TitleRange = Record<number, boolean>;

function generateColumnTitles(props: {
  date: string;
  columnCount: number;
  titleRange: TitleRange;
}) {
  return dateRange(props.date, props.columnCount, 'days').map((val, index) => {
    return (
      <div
        key={val}
        style={{
          background: props.titleRange[index] ? '#1ca3f9' : '#fff',
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
  // const [guestName, setGuestName] = useState('')
  const [newReservation, setNewReservation] = useState<StateBar | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [draggingElement, setDraggingElement] = useState<DraggingElement>(null);

  const [titleRange, setTitleRange] = useState<TitleRange>({});
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reserverRef = useRef<any>(null);

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

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'unset'
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
              ref={reserverRef}
              columnTitleHeight={columnTitleHeight}
              dimension={cellDimension}
              rowTitleWidth={rowTitleWidth}
              isDragging={isDragging}
              rowTitles={generateRowTitles(hoverRow)}
              columnTitles={generateColumnTitles({
                date: startDate.toISOString(),
                columnCount: daysTotal,
                titleRange
              })}
              content={(columnCount, rowCount) => {
                const content = {};

                Array(rowCount)
                  .fill(null)
                  .forEach((_, r) => {
                    Array(columnCount)
                      .fill(null)
                      .forEach((_, c) => {
                        const isDropPlace = isDragging && titleRange[c] && hoverRow === r;

                        const dropColumnsIndexes = Object.entries(titleRange)
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
              BodyCellProps={{
                onPointerDown: (props, e) => {
                  (e.target as Element).releasePointerCapture(e.pointerId);
                  const newbar = createBar(props.dimension, props.cell, {
                    new: true
                  });

                  const selectionRange = {};

                  [...Array(newbar.length)].forEach((na, i) => {
                    selectionRange[i + newbar.column] = true;
                  });

                  setTitleRange(selectionRange);

                  setHoverRow(newbar.row);
                  setNewReservation(newbar);
                  addBar(newbar);
                  setDraggingElement(newbar);
                  setIsEditing(true);
                },
                onPointerEnter: (props, e) => {
                  (e.target as Element).releasePointerCapture(e.pointerId);
                  if (isDragging && !isEditing && draggingElement) {
                    const selectionRange = {};
                    [...Array(draggingElement?.length)].forEach((na, i) => {
                      if (draggingElement.selectedCell !== undefined) {
                        selectionRange[i + props.cell.column - draggingElement.selectedCell] = true;
                      }
                    });
                    const cellBar =
                      bars.find(
                        (b) =>
                          b.column <= props.cell.column &&
                          b.column + b.length >= props.cell.column &&
                          b.row === props.cell.row
                      ) || null;

                    if (
                      bars.some(
                        (b) =>
                          b.row === props.cell.row &&
                          Object.keys(selectionRange).some((k) => +k === b.column) &&
                          b.id !== cellBar?.id
                      )
                    ) {
                      return;
                    }
                    setHoverRow(props.cell.row);
                    setTitleRange(selectionRange);
                  }

                  if (isEditing && draggingElement) {
                    const evaluatedBar = evaluatePosition(draggingElement, props.cell);

                    const selectionRange = {};

                    [...Array(evaluatedBar.length)].forEach((na, i) => {
                      selectionRange[i + evaluatedBar.column] = true;
                    });
                    setHoverRow(evaluatedBar.row);
                    setTitleRange(selectionRange);
                    setDraggingElement(evaluatedBar);
                    editBar(evaluatedBar);
                  }
                },
                onPointerUp: ({ cell }) => {
                  if (isDragging && !isEditing && draggingElement && draggingElement.selectedCell) {
                    const bar = {
                      ...draggingElement,
                      row: cell.row,
                      column: (cell?.column || 0) - draggingElement.selectedCell,
                      moving: false
                    };

                    editBar(bar);

                    setStyle(`.reserver-drag{transform: translate(0px,0px)}`);
                    setTitleRange({});
                    setHoverRow(-1);
                    setIsDragging(false);
                  }

                  if (isEditing) {
                    const bar = bars.find((bar) => {
                      return bar.editing;
                    });
                    if (!isObjectEmpty(newReservation)) {
                      setNewReservation(bar || null);
                      // toggleAddReservation()
                    }

                    editBar({ ...bar, editing: false });
                    setHoverRow(-1);
                    setTitleRange({});
                    setIsEditing(false);
                  }
                }
              }}
              // onPointerLeave={(e) => {
              //   if (e.buttons === 1) {
              //     setIsDragging(false);
              //     setDraggingElement((draggingElement) => {
              //       editBar({ ...draggingElement, moving: false });
              //       return null;
              //     });
              //   }
              // }}
              onPointerMove={(e) => {
                if (isDragging && !isEditing && draggingElement) {
                  setStyle(
                    `.reserver-drag{transform: translate(${
                      e.pageX - (draggingElement.draggingLeft || 0)
                    }px,${e.pageY - (draggingElement.draggingTop || 0)}px)}`
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
                            pointerEvents: bar.editing || bar.moving ? 'none' : 'auto',
                            zIndex: 1000,
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
                            (e.target as Element).releasePointerCapture(e.pointerId);
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
                                  cursor: 'e-resize'
                                }}
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  (e.target as Element).releasePointerCapture(e.pointerId);
                                  const newbar: DraggingElement = {
                                    ...bar,
                                    stick: 'left',
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
                                  cursor: 'e-resize'
                                }}
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  (e.target as Element).releasePointerCapture(e.pointerId);
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
