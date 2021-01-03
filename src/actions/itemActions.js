import { ADD_ITEM_FAIL, ADD_ITEM_SUCCESS, DELETE_ITEM_FAIL, DELETE_ITEM_SUCCESS, CLEAR_ADD_ITEM, CLEAR_ITEMS, GET_ITEMS_FAIL, GET_ITEMS_SUCCESS, UPDATE_ITEM } from './types';
import { parseError } from '../util/validation';
import { logout } from './userActions';

const serviceUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000/api' : 'https://myshoppinglistserver.herokuapp.com/api';

export const getItems = () => async (dispatch) => {
    const response = await fetch(`${serviceUri}/items/items`, {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (response.status === 200) {
        dispatch({
            type: GET_ITEMS_SUCCESS,
            payload: data
        });
    } else {
        dispatch({
            type: GET_ITEMS_FAIL
        });
        dispatch(logout());
    }
};

export const addItem = (item) => async (dispatch) => {
    try {
        const response = await fetch(`${serviceUri}/items/item`, {
            method: 'POST',
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item })
        });
        const data = await response.json();
        if (response.status === 500) {
            const { message } = data;
            const errors = message.split(',').map((error) => parseError(error));
            dispatch({
                type: ADD_ITEM_FAIL,
                payload: errors
            });
        } else if (response.status === 401) {
            dispatch(logout());
        } else {
            dispatch({
                type: ADD_ITEM_SUCCESS,
                payload: data
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};

export const updateItem = (item) => async (dispatch) => {
    try {
        const response = await fetch(`${serviceUri}/items/item?id=${item.id}`, {
            method: 'PUT',
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: item.name,
                cost: item.cost,
                dateAdded: item.dateAdded,
                purchaseByDate: item.purchaseByDate,
                linkToProduct: item.linkToProduct
            })
        });
        if (response.status === 401) {
            dispatch(logout());
        } else {
            dispatch({
                type: UPDATE_ITEM
            });
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
    dispatch(getItems());
};

export const deleteItem = (item) => async (dispatch) => {
    try {
        const response = await fetch(`${serviceUri}/items/item?id=${item._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.deleted) {
            dispatch({
                type: DELETE_ITEM_SUCCESS
            });
            dispatch(getItems());
        } else if (response.status === 401) {
            dispatch(logout());
        } else {
            dispatch({
                type: DELETE_ITEM_FAIL,
                payload: data.message
            });
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

export const clearAddItem = () => (dispatch) => {
    dispatch({
        type: CLEAR_ADD_ITEM
    });
};

export const clearItems = () => (dispatch) => {
    dispatch({
        type: CLEAR_ITEMS
    });
};