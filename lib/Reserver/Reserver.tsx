import React, { FC, useMemo, useState } from 'react';
import Grid from '../Grid';

import clsx from 'clsx';

import moment from 'moment';
import useReserver from '../useReserver';
import { EditingElement, ReserverProps, SelectedColumns } from './types';
import useStyle from '../hooks/useStyle';
import { evaluatePosition, formatToDate, isObjectEmpty } from '../helpers';
import { dateRange, generateRowTitles } from './helpers';
import Peg from '../Peg';
import { GridContent } from '../Grid/types';
import createBar from '../utils/createBar';
import Bar from '../Bar';
import Tag from '../Tag';

import { hasCollisions } from '../collision';
import { getPosition } from './../helpers';
import { DATE_FORMAT, ROOT_CLASS_NAME } from '../constants';
import { StateBar } from '../types';
import { BodyCellEventHandler } from '../BodyCell/types';

const defaultDimension = { width: 40, height: 30 };
const startDate = moment.utc(moment.now()).add(-15, 'days');

const Reserver: FC<ReserverProps> = ({
  reservationItems,
  value,
  onChange,
  dimension = defaultDimension,
  slotComponents,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isColliding, setIsColliding] = useState(false);

  const { bars, addBar, editBar } = useReserver({
    // dimension,
    initialReservations: value,
    onChange,
    startDate
  });

  const headerHeight = props.headerHeight || dimension.height;

  const rowTitleWidth = 130;

  const daysTotal = 30;
  const [newReservation, setNewReservation] = useState<StateBar | null>(null);

  const [editingElement, setEditingElement] = useState<EditingElement | null>(null);

  const hoverRow = editingElement ? editingElement.row : null;

  const selectedColumns: SelectedColumns = useMemo(() => {
    const selectionRange: SelectedColumns = {};
    if (!editingElement) {
      return selectionRange;
    }
    [...Array(editingElement.length)].forEach((_, i) => {
      selectionRange[i + editingElement.column] = true;
    });
    return selectionRange;
  }, [editingElement]);

  const columnDates = useMemo(() => dateRange(startDate.toISOString(), daysTotal, 'days'), []);

  const setStyle = useStyle();

  const handleDropBarOnCell =
    (editingElement: EditingElement | null): BodyCellEventHandler =>
    ({ cell, date }, e) => {
      e.currentTarget.releasePointerCapture((e as unknown as { pointerId: number }).pointerId);

      const newColumnValue = (cell?.column || 1) - (editingElement?.selectedCell || 0);
      const newColumn = newColumnValue < 0 ? 0 : newColumnValue;

      const startDate = moment(date)
        .add(newColumn - (editingElement?.column || 0), 'days')
        .format(DATE_FORMAT);
      const endDate = moment(date)
        .add(newColumn - (editingElement?.column || 0) + (editingElement?.length || 0), 'days')
        .format(DATE_FORMAT);

      if (isDragging && !isEditing && editingElement && editingElement.selectedCell !== undefined) {
        const bar: StateBar = {
          ...editingElement,
          row: isColliding ? editingElement.row : cell.row,
          column: isColliding ? editingElement.column : newColumn,
          start: startDate,
          end: endDate,
          moving: false,
          editing: false
        };

        editBar(bar);

        setStyle(`.${ROOT_CLASS_NAME} .reserver-drag{transform: translate(0px,0px)}`);
        setIsDragging(false);
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
          const newValue =
            editingElement?.stick == 'left'
              ? { ...bar, editing: false, end: formatToDate(date) }
              : { ...bar, editing: false, start: formatToDate(date) };

          editBar(newValue);
        }
        setIsEditing(false);
      }
      setEditingElement(null);
    };

  return (
    <>
      <div
        className={ROOT_CLASS_NAME}
        style={{
          cursor: isColliding ? 'not-allowed' : isDragging ? 'grabbing' : 'unset'
        }}
      >
        <div>
          <Grid
            slotComponents={slotComponents}
            dimension={dimension}
            rowTitleWidth={rowTitleWidth}
            isDragging={isDragging}
            rowTitles={generateRowTitles(reservationItems, hoverRow)}
            content={(columnCount, rowCount) => {
              const content: GridContent = {};

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
              editingElement &&
              editingElement.selectedCell !== undefined &&
              handleDropBarOnCell(editingElement)(
                {
                  cell: {
                    column: editingElement.column + editingElement.selectedCell,
                    row: editingElement?.row
                  },
                  date: columnDates[editingElement.column + editingElement.selectedCell],
                  dimension
                },
                e
              )
            }
            HeadProps={{
              columnDates,
              height: headerHeight
            }}
            BodyCellProps={{
              onPointerDown: (props, e) => {
                if (isDragging || isEditing) {
                  handleDropBarOnCell(editingElement)(props, e);
                  return;
                }
                e.currentTarget.releasePointerCapture(e.pointerId);
                const newbar = createBar(props.dimension, props.cell, {
                  new: true,
                  start: formatToDate(props.date),
                  end: formatToDate(props.date)
                });

                setNewReservation(newbar);
                addBar(newbar);
                setEditingElement(newbar);
                setIsEditing(true);
              },
              isResizing: isEditing,
              onPointerEnter: (props, e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);

                if (isDragging && !isEditing && editingElement) {
                  const newColumnValue = props.cell.column - (editingElement.selectedCell || 0);
                  const newColumn = newColumnValue < 0 ? 0 : newColumnValue;

                  const collision = hasCollisions(
                    {
                      ...editingElement,
                      row: props.cell.row || editingElement.row,
                      column: newColumn
                    },
                    bars.filter((b) => b.id !== editingElement.id)
                  );
                  setEditingElement((prev) => {
                    if (!prev) {
                      return null;
                    }
                    return {
                      ...prev,
                      column: collision ? prev.column : newColumn,
                      row: collision ? prev?.row : props.cell.row
                    };
                  });
                  setIsColliding(collision);
                }

                if (isEditing) {
                  setEditingElement((prev) => {
                    if (!prev) {
                      return prev;
                    }
                    const evaluatedBar = evaluatePosition(prev, props.cell, props.date);
                    if (!evaluatedBar) {
                      return null;
                    }

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
              onPointerUp: handleDropBarOnCell(editingElement)
            }}
            onPointerMove={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);

              if (isDragging && !isEditing && editingElement) {
                setStyle(
                  `.${ROOT_CLASS_NAME} .reserver-drag{transform: translate(${
                    e.pageX - (editingElement.draggingLeft || 0)
                  }px,${e.pageY - (editingElement.draggingTop || 0)}px); scale: 103%; }`
                );
              }
            }}
          >
            {({ rowTitleWidth }) => {
              return (
                <>
                  {bars.map((bar) => {
                    return (
                      <Bar
                        id={bar.id}
                        draggable
                        length={bar.length}
                        dimension={dimension}
                        style={{
                          ...(bar as unknown as { style: React.CSSProperties }).style,
                          borderRadius: dimension.height / 2,

                          pointerEvents:
                            bar.editing || bar.moving || isColliding || isDragging || isEditing
                              ? 'none'
                              : 'auto',
                          zIndex: isDragging && editingElement?.id === bar.id ? 1001 : 1000,
                          scale: isEditing && editingElement?.id === bar.id ? '103%' : undefined,
                          transition: '.15s ease-in-out scale',
                          height: dimension.height,
                          cursor:
                            isDragging && editingElement?.id !== bar.id ? 'not-allowed' : 'grab',
                          ...getPosition(
                            bar.row,
                            bar.column,
                            dimension,
                            rowTitleWidth,
                            headerHeight
                          )
                        }}
                        onPointerDown={(e) => {
                          e.currentTarget.releasePointerCapture(e.pointerId);
                          if (isEditing) {
                            e.preventDefault();
                            return;
                          }
                          setIsDragging(true);

                          const target = e.currentTarget.getBoundingClientRect();

                          const relativeX = e.pageX - target.left;

                          const selectedCellIndex =
                            (relativeX / dimension.width > bar.length - 1
                              ? bar.length
                              : Math.round(relativeX / dimension.width)) - 1;

                          const element: EditingElement = {
                            ...bar,
                            selectedCell: selectedCellIndex,
                            moving: true,
                            draggingLeft: e.pageX,
                            draggingTop: e.pageY,
                            stick: 'left'
                          };

                          editBar(element);
                          setEditingElement(element);
                        }}
                        key={bar.id}
                        className={bar.moving ? 'reserver-drag' : ''}
                        lastContent={
                          <div
                            style={{
                              height: '100%',
                              width: dimension.width / 3,
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              role="button"
                              style={{
                                zIndex: 10000,
                                width: '100%',
                                height: '100%',
                                cursor: isDragging ? '' : 'e-resize'
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                e.currentTarget.releasePointerCapture(e.pointerId);
                                const resizedBar: EditingElement = {
                                  ...bar,
                                  selectedCell: 0,
                                  stick: 'left',
                                  editing: true
                                };
                                setEditingElement(resizedBar);
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
                              height: '100%',
                              width: dimension.width / 3,
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              role="button"
                              style={{
                                zIndex: 10000,
                                width: '100%',
                                height: '100%',
                                cursor: isDragging ? '' : 'e-resize'
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                e.currentTarget.releasePointerCapture(e.pointerId);
                                const newbar: EditingElement = {
                                  ...bar,
                                  selectedCell: bar.length - 1,
                                  stick: 'right',
                                  editing: true
                                };
                                editBar(newbar);
                                setEditingElement(newbar);
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
                            width: bar.length * dimension.width - 32,
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
          </Grid>
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
};

export default Reserver;
