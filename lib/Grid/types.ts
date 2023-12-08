import { ReactNode } from 'react';
import { Dimension } from '../types';
import { HeadProps } from '../Head/types';
import { ReserverSlotComponents } from '../Reserver/types';
import { BodyCellProps } from '../BodyCell/types';

export type GridContent = Record<`r${number}c${number}`, ReactNode>;

export type GetGridContent = (columnCount: number, rowCount: number) => GridContent;

type Titles = ReactNode[];

export type ChildrenProps = {
  rowCount: number;
  columnCount: number;
  rowTitleWidth: number;
  dimension: Dimension;
};

export type GridProps = Omit<React.ComponentProps<'div'>, 'content' | 'children'> & {
  dimension: Dimension;
  rowTitleWidth: number;
  rowTitles: Titles;

  columnTitleClassName?: string;
  cantonClassName?: string;
  rowTitleClassName?: string;
  cellClassName?: string;
  isDragging?: boolean;
  content?: GetGridContent;

  children: (props: ChildrenProps) => ReactNode;

  HeadProps: Partial<HeadProps> & Pick<HeadProps, 'columnDates' | 'height'>;
  BodyCellProps?: Partial<BodyCellProps>;
  slotComponents?: ReserverSlotComponents;
};
