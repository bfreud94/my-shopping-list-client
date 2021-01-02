import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from './types';

const serviceUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000/api' : 'https://myshoppinglistserver.herokuapp.com/api';

export const login = (data) => async (dispatch) => {
    try {
        const response = await fetch(`${serviceUri}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
        });
        const userData = await response.json();
        if (response.status === 200 && userData.token) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: userData
            });
        } else {
            dispatch({
                type: LOGIN_FAIL,
                payload: userData
            });
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

export const register = (data) => async (dispatch) => {
    const response = await (await fetch(`${serviceUri}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        })
    })).json();
    if (response.registered) {
        dispatch({
            type: REGISTER_SUCCESS
        });
        dispatch(login(data));
    } else {
        dispatch({
            type: REGISTER_FAIL,
            payload: response.error
        });
        // eslint-disable-next-line no-console
        console.log(`Error: ${response.error}`);
    }
};

export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
        payload: {}
    });
};