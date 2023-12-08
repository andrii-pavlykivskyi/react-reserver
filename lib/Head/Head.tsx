import Cell from '../Cell';
import DefaultHeaderCell from './DefaultHeaderCell';
import { HeadProps } from './types';

export default function Head({
  dir = 'ltr',
  canton = null,
  onMouseOverCell = () => {},
  height,
  slotComponents,
  ...props
}: HeadProps) {
  const HeaderCell =
    slotComponents && slotComponents.HeaderCell ? slotComponents.HeaderCell : DefaultHeaderCell;

  return (
    <div
      role="columnheader"
      className={props.rowTitleClassName}
      style={{
        display: props.isVisible ? 'flex' : 'none',
        height: height
      }}
    >
      {dir === 'ltr' && (
        <Cell
          dimension={{
            height: height,
            width: props.rowTitleWidth
          }}
          row={-1}
          column={-1}
          className={props.cantonClassName}
          isHeading
        >
          {canton}
        </Cell>
      )}
      {props.columnDates.map((date, i) => {
        return (
          <Cell
            aria-colindex={i}
            key={i}
            onMouseOver={onMouseOverCell}
            dimension={{
              height,
              width: props.dimension.width
            }}
            column={i}
            row={-1}
            className={props.columnTitleClassName}
            isHeading
          >
            <HeaderCell date={date} />
          </Cell>
        );
      })}
      {dir === 'rtl' && (
        <Cell
          dimension={{
            height: height,
            width: props.rowTitleWidth
          }}
          row={-1}
          column={props.columnDates.length}
          className={props.cantonClassName}
          isHeading
        >
          {canton}
        </Cell>
      )}
    </div>
  );
}
