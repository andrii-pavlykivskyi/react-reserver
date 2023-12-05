/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer, useCallback } from 'react';
import actionTypes from './actionTypes';
import { ReserverReducer } from './reserverReducer';

function useReserver(reducer: ReserverReducer, initialState: any) {
  const [{ bars, isEditing }, dispatch] = useReducer(reducer, {
    bars: initialState,
    isEditing: false
  });

  const addBar = useCallback((props: any) => {
    return dispatch({ payload: props, type: actionTypes.add });
  }, []);

  const editBar = useCallback((props: any) => {
    return dispatch({ payload: props, type: actionTypes.edit });
  }, []);

  const deleteBar = useCallback((props: any) => {
    return dispatch({ payload: props, type: actionTypes.delete });
  }, []);

  const setBars = useCallback((props: any) => {
    return dispatch({ payload: props, type: actionTypes.setBars });
  }, []);

  const setIsEditing = useCallback((props: any) => {
    return dispatch({ payload: props, type: actionTypes.setIsEditing });
  }, []);

  return {
    isEditing,
    setIsEditing,
    bars,
    addBar,
    editBar,
    deleteBar,
    setBars
  };
}
export default useReserver;
