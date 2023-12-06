/* eslint-disable @typescript-eslint/no-explicit-any */
import actionTypes from './actionTypes';
import { BarStick, Dimension } from './types';
import { ReactNode } from 'react';

export type StateBar = {
  to: string;
  from: string;
  column: number;
  row: number;
  id: string;
  length: number;
  editing: boolean;
  dimension: Dimension;
  moving: boolean;
  name: ReactNode;
  stick: BarStick
};

type ReserverState = {
  bars: StateBar[];
  isEditing: boolean;
};

export type ReserverReducer = React.Reducer<ReserverState, any>;

export const reserverReducer: ReserverReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.setBars: {
      return { ...state, bars: action.payload };
    }
    case actionTypes.edit: {
      const nBars = [...state.bars];
      const bIndex = nBars.findIndex((bar) => {
        return action.payload.id === bar.id;
      });

      nBars[bIndex] = action.payload;

      return { ...state, bars: nBars };
    }
    case actionTypes.add: {
      const bars = [...state.bars];

      bars.push(action.payload);

      return { ...state, bars: bars };
    }

    case actionTypes.delete: {
      const nBars = [...state.bars];
      const bIndex = nBars.findIndex((bar) => {
        return action.payload.id === bar.id;
      });

      nBars.splice(bIndex, 1);

      return { ...state, bars: nBars };
    }
    case actionTypes.setIsEditing: {
      return { ...state, isEditing: action.payload };
    }
  }
  return state;
};
