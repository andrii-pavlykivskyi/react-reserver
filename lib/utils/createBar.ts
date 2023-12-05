import { CellCoordinates, Dimension } from '../types';
import makeID from './makeID';

export default function createBar(
  dimension: Dimension,
  startLocation: Partial<CellCoordinates>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
) {
  return {
    id: makeID(),
    length: 1,
    dimension: dimension,
    editing: true,
    ...startLocation,
    ...props
  };
}
