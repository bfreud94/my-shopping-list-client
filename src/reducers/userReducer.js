import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from '../actions/types';

const initialState = {
    user: {},
    error: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                user: action.payload.user,
                error: ''
            };
        case LOGIN_FAIL:
            return {
                ...state,
                error: action.payload.error
            };
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: {},
                error: ''
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                justRegistered: true
            };
        case REGISTER_FAIL:
            return {
                ...state,
                error: action.payload,
                registrationFail: true
            };
        default:
            return state;
    }
}