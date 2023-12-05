import { isBetween } from './helpers';
import { TBar } from './types';

export function checkCollisions(bars: TBar[]) {
  let nBars = [...bars];
  const editingBars = bars.filter((b) => b.editing);

  editingBars.forEach((bar) => {
    const [cBars, eBar] = reviewBars(nBars, bar);
    cBars.push(eBar);
    nBars = cBars;
  });

  return nBars;
}

export function reviewBars(bars: TBar[], eBar: TBar): [TBar[], TBar] {
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

export const collided = (bar1: TBar, bar2: TBar): [TBar, TBar] => {
  const bar = checkHasCollisionObject(bar1);
  if (!bar.collisions) {
    bar.collisions = {};
  }
  bar.collisions[bar2.id] = '';

  const secondBar = checkHasCollisionObject(bar2);
  if (!secondBar.collisions) {
    secondBar.collisions = {};
  }
  secondBar.collisions[bar1.id] = '';

  return [bar, secondBar];
};

export const checkHasCollisionObject = (bar: TBar): TBar => {
  return { ...bar, collisions: {} };
};

export const removeCollision = (bar1: TBar, bar2: TBar) => {
  bar1 = checkHasCollisionObject(bar1);
  if (bar1.collisions) {
    delete bar1.collisions[bar2.id];
  }
  bar2 = checkHasCollisionObject(bar2);
  if (bar2.collisions) {
    delete bar2.collisions[bar1.id];
  }
  return [bar1, bar2];
};
