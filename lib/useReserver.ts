/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer } from 'react'
import actionTypes from './actionTypes'
import { ReserverReducer } from './reserverReducer'

function useReserver(reducer: ReserverReducer, initialState: any) {
  const [{ bars, isEditing }, dispatch] = useReducer(reducer, {
    bars: initialState,
    isEditing: false
  })

  const addBar = (props: any) => {
    return dispatch({ payload: props, type: actionTypes.add })
  }

  const editBar = (props: any) => {
    return dispatch({ payload: props, type: actionTypes.edit })
  }

  const deleteBar = (props: any) => {
    return dispatch({ payload: props, type: actionTypes.delete })
  }

  const setBars = (props: any) => {
    return dispatch({ payload: props, type: actionTypes.setBars })
  }

  const setIsEditing = (props: any) => {
    return dispatch({ payload: props, type: actionTypes.setIsEditing })
  }

  return {
    isEditing,
    setIsEditing,
    bars,
    addBar,
    editBar,
    deleteBar,
    setBars
  }
}
export default useReserver
