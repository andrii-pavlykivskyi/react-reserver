import { Dimension, Position } from '../types'
import makeID from './makeID'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createBar(dimension: Dimension, startLocation: Position, props: any) {
  return {
    id: makeID(),
    length: 1,
    dimension: dimension,
    editing: true,
    ...startLocation,
    ...props
  }
}
