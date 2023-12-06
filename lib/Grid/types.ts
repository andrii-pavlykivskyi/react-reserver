import { ReactNode } from 'react';
import { Dimension } from '../types';
import { CellProps } from '../Cell';
import { HeadProps } from '../Head';

export type GridContent = Record<`r${number}c${number}`, ReactNode>;

export type GetGridContent = (columnCount: number, rowCount: number) => GridContent;

type Titles = ReactNode[];

export type ChildrenProps = {
  rowCount: number;
  columnCount: number;
  rowTitleWidth: number;
  dimension: Dimension;
  columnTitleHeight: number;
};

export type Grid = Omit<React.ComponentProps<'div'>, 'content' | 'children'> & {
  dimension: Dimension;
  rowTitleWidth: number;
  rowTitles: Titles;
  columnTitles: Titles;
  columnTitleHeight: number;

  columnTitleClassName?: string;
  cantonClassName?: string;
  rowTitleClassName?: string;
  cellClassName?: string;
  isDragging?: boolean;
  content?: GetGridContent;

  children: (props: ChildrenProps) => ReactNode;

  HeadProps?: Partial<HeadProps>;
  BodyCellProps?: Partial<CellProps>;
};
