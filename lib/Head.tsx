import { ReactNode } from 'react';

import Cell from './Cell';
import { Dimension } from './types';
export type HeadProps = {
  isVisible: boolean;
  dimension: Dimension;
  rowTitleWidth: number;
  columnTitles: ReactNode[];
  columnCount: number;
  height: number;
  dir?: string;
  canton?: ReactNode;
  rowTitleClassName?: string;
  columnTitleClassName?: string;
  cantonClassName?: string;
  onMouseOverCell?: () => void;
};

export default function Head({
  dir = 'ltr',
  canton = null,
  onMouseOverCell = () => {},
  ...props
}: HeadProps) {
  return (
    <div
      role="columnheader"
      className={props.rowTitleClassName}
      style={{
        display: props.isVisible ? 'flex' : 'none',
        height: props.dimension.height
      }}
    >
      {dir === 'ltr' && (
        <Cell
          dimension={{
            height: props.dimension.height,
            width: props.rowTitleWidth
          }}
          row={-1}
          column={-1}
          className={props.cantonClassName}
        >
          {canton}
        </Cell>
      )}
      {props.columnTitles.map((headitem, i) => {
        return (
          <Cell
            aria-colindex={i}
            key={i}
            onMouseOver={onMouseOverCell}
            dimension={props.dimension}
            column={i}
            row={-1}
            className={props.columnTitleClassName}
          >
            {headitem}
          </Cell>
        );
      })}
      {dir === 'rtl' && (
        <Cell
          dimension={{
            height: props.dimension.height,
            width: props.rowTitleWidth
          }}
          row={-1}
          column={props.columnTitles.length}
          className={props.cantonClassName}
        >
          {canton}
        </Cell>
      )}
    </div>
  );
}
