const actionTypes = {
  add: 'ADD',
  edit: 'EDIT',
  delete: 'DELETE',
  setBars: 'SET_BARS',
} as const;

export type ActionType = (typeof actionTypes)[keyof typeof actionTypes];

export default actionTypes;
