import { FC } from 'react';
import { HeaderCellProps } from './types';
import { DEFAULT_LOCALE } from '../constants';

const DefaultHeaderCell: FC<HeaderCellProps> = ({ date, locale = DEFAULT_LOCALE }) => {
  return <>{date.toLocaleDateString(locale, { day: 'numeric' })}</>;
};

export default DefaultHeaderCell;
