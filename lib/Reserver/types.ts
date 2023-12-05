import { ReactNode } from 'react';
import { Dimension } from '../types';
import { CellEventHandler, CellPointerEventHandler } from '../Cell';
import { HeadProps } from '../Head';

export type ReserverContent = Record<`r${number}c${number}`, ReactNode>;

export type GetReserverContent = (columnCount: number, rowCount: number) => ReserverContent;

type Titles = ReactNode[];

export type ChildrenProps = {
  rowCount: number;
  columnCount: number;
  rowTitleWidth: number;
  dimension: Dimension;
  columnTitleHeight: number;
};

export type ReserverProps = Omit<React.ComponentProps<'div'>, 'content' | 'children'> & {
  content?: GetReserverContent;
  dimension: Dimension;
  rowTitleWidth: number;
  rowTitles: Titles;
  columnTitles: Titles;
  columnTitleHeight: number;
  columnTitleClassName?: string;
  cantonClassName?: string;
  rowTitleClassName?: string;
  cellClassName?: string;

  mouseDownCell?: CellEventHandler;
  mouseEnterCell?: CellEventHandler;
  mouseUpCell?: CellEventHandler;
  mouseDropCell?: CellEventHandler;
  mouseDragOverCell?: CellEventHandler;
  pointerDownCell?: CellPointerEventHandler;
  pointerMoveCell?: CellPointerEventHandler;
  pointerEnterCell?: CellPointerEventHandler;
  pointerLeaveCell?: CellPointerEventHandler;
  pointerUpCell?: CellPointerEventHandler;
  pointerOverCell?: CellPointerEventHandler;

  children: (props: ChildrenProps) => ReactNode;

  HeadProps?: Partial<HeadProps>;
};
