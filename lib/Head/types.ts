import { ReactNode } from 'react';

import { Dimension } from '../types';
import { ReserverSlotComponents } from '../Reserver/types';
export type HeadProps = {
  isVisible: boolean;
  dimension: Dimension;
  rowTitleWidth: number;
  columnDates: Date[];
  columnCount: number;
  height: number;
  dir?: string;
  canton?: ReactNode;
  rowTitleClassName?: string;
  columnTitleClassName?: string;
  cantonClassName?: string;
  onMouseOverCell?: () => void;
  slotComponents?: ReserverSlotComponents;
};

export type HeaderCellProps = {
  date: Date;
  locale?: Intl.LocalesArgument;
};
