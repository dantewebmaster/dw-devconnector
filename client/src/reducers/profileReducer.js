import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
	profile: null,
	profiles: null,
	loading: false
}

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case PROFILE_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false
			};
		case CLEAR_CURRENT_PROFILE:
			return {
				...state,
				profile: initialState.profile
			}
		default:
			return state;
	}
}
