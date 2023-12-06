import { isBetween } from './helpers';
import { StateBar } from './reserverReducer';

type CollisionBar = Omit<StateBar, 'stick'> &
  Partial<Pick<StateBar, 'stick'>> & { collisions?: Record<string, boolean | string> };

export function checkCollisions(bars: CollisionBar[]) {
  let nBars = [...bars];
  const editingBars = bars.filter((b) => b.editing);

  editingBars.forEach((bar) => {
    const [cBars, eBar] = reviewBars(nBars, bar);
    cBars.push(eBar);
    nBars = cBars;
  });

  return nBars;
}

export function reviewBars(
  bars: CollisionBar[],
  eBar: CollisionBar
): [CollisionBar[], CollisionBar] {
  let editingBar = { ...eBar };
  const oBars = bars.flatMap((b) => {
    if (b.id === eBar.id) {
      return [];
    }
    if (editingBar.row === b.row) {
      const bStart = b.column + 1;
      const barStart = editingBar.column + 1;
      const bTotal = b.column + b.length;
      const editingBarTotal = editingBar.column + editingBar.length;

      if (
        isBetween(bStart, bTotal, barStart) ||
        isBetween(bStart, bTotal, editingBarTotal) ||
        isBetween(barStart, editingBarTotal, bTotal) ||
        isBetween(barStart, editingBarTotal, bStart)
      ) {
        const [bar1, bar2] = collided(b, editingBar);
        editingBar = bar2;
        return bar1;
      } else {
        const [bar1, bar2] = removeCollision(b, editingBar);

        editingBar = bar2;
        return bar1;
      }
    } else {
      const [bar1, bar2] = removeCollision(b, editingBar);

      editingBar = bar2;
      return bar1;
    }
  });

  return [oBars, editingBar];
}
export const collided = (bar1: CollisionBar, bar2: CollisionBar) => {
  if (!bar1.collisions) {
    bar1.collisions = {};
  }
  bar1.collisions[bar2.id] = '';

  if (!bar2.collisions) {
    bar2.collisions = {};
  }
  bar2.collisions[bar1.id] = '';

  return [bar1, bar2];
};

export const removeCollision = (bar1: CollisionBar, bar2: CollisionBar) => {
  if (!bar1.collisions) {
    bar1.collisions = {};
  }
  delete bar1.collisions[bar2.id];
  if (!bar2.collisions) {
    bar2.collisions = {};
  }
  delete bar2.collisions[bar1.id];
  return [bar1, bar2];
};

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
