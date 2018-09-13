import isEmpty from '../validation/is-empty'

// Action types
import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
	isAuthenticated: false,
	user: {},
}

export default function(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(payload),
				user: payload
			}
		default:
			return state;
	}
}