// Alert Reducer

import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = [
];
// create state array


export default function (state = initialState, action) {

  const {type, payload} = action;


  //DISPATCH
  switch (type) {
    case SET_ALERT:
      return [...state, action.payload];

    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);

    default:
      return state;
  }
}
//alerts will be objects in array, with ID,Message, and alert type.