import { StateBar } from './types';

type CollisionBar = Omit<StateBar, 'stick'> &
  Partial<Pick<StateBar, 'stick'>> & { collisions?: Record<string, boolean | string> };

function calculateIntersectionLength(
  start1: number,
  length1: number,
  start2: number,
  length2: number
) {
  const end1 = start1 + length1;
  const end2 = start2 + length2;

  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);

  if (overlapStart < overlapEnd) {
    return overlapEnd - overlapStart;
  } else {
    return 0;
  }
}

function areBarsColliding(bar1: CollisionBar, bar2: CollisionBar) {
  const columnsCollision = calculateIntersectionLength(
    bar1.column,
    bar1.length,
    bar2.column,
    bar2.length
  );

  const rowsCollision = bar1.row === bar2.row;

  return columnsCollision > 0 && rowsCollision;
}

export const hasCollisions = (movingBar: CollisionBar, bars: CollisionBar[]) => {
  return bars.some((b) => areBarsColliding(b, movingBar));
};
