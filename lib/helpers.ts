/* eslint-disable @typescript-eslint/no-explicit-any */

import moment from 'moment';
import { CellCoordinates, Dimension, Position } from './types';
import { DATE_FORMAT } from './constants';
import { EditingElement } from './Reserver/types';

export const formatToDate = (date: Date) => moment(date).format(DATE_FORMAT);

export function getPosition(
  row: number,
  column: number,
  dimension: Dimension,
  rowTitleWidth = 0,
  headerHeight = 0
): Position {
  return {
    left: rowTitleWidth + column * dimension.width,
    top: row * dimension.height + headerHeight
  };
}
export function evaluatePosition(
  bar: EditingElement,
  newLocation: CellCoordinates,
  date: Date
): EditingElement {
  const stringDate = formatToDate(date);
  // We check stick right if there is a resizing after originally done.
  // The greater than length 1 is to allow resizing to other direction
  if (bar.column > newLocation.column || (bar.stick === 'right' && bar.length > 1)) {
    bar.stick = 'right';
    const locationForRight: Partial<EditingElement> = {
      row: bar.row,
      start: stringDate,
      end: formatToDate(
        moment(date)
          .add(newLocation.column * -1 + bar.length, 'days')
          .toDate()
      ),
      column: newLocation.column,
      length: bar.column - newLocation.column + bar.length
    };
    return { ...bar, ...locationForRight };
  }

  bar.stick = 'left';
  const locationForLeft: Partial<EditingElement> = {
    row: bar.row,
    start: stringDate,
    end: formatToDate(
      moment(date)
        .add(newLocation.column - bar.length + 1, 'days')
        .toDate()
    ),
    column: bar.column,
    length: newLocation.column - bar.column + 1
  };
  return { ...bar, ...locationForLeft };
}

export function isObjectEmpty(obj: any): boolean {
  for (const _ in obj) return false;
  return true;
}
