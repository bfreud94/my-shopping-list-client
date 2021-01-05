import { ADD_ITEM_FAIL, ADD_ITEM_SUCCESS, CLEAR_ADD_ITEM, CLEAR_ITEMS, DELETE_ITEM_FAIL, DELETE_ITEM_SUCCESS, GET_ITEMS_FAIL, GET_ITEMS_SUCCESS, UPDATE_ITEM } from '../actions/types';

const initialState = {
    items: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_ITEM_SUCCESS:
            return {
                ...state,
                addItemSuccess: true,
                addItemErrors: []
            };
        case ADD_ITEM_FAIL:
            return {
                ...state,
                addItemSuccess: false,
                addItemErrors: action.payload
            };
        case DELETE_ITEM_SUCCESS:
            return {
                ...state,
                deleteItemSuccess: true
            };
        case DELETE_ITEM_FAIL:
            return {
                ...state,
                deleteItemSuccess: false,
                deleteItemError: action.payload
            };
        case GET_ITEMS_SUCCESS:
            return {
                ...state,
                items: action.payload
            };
        case GET_ITEMS_FAIL:
            return {
                ...state,
                errors: action.payload
            };
        case CLEAR_ITEMS:
            return {
                items: []
            };
        case CLEAR_ADD_ITEM:
            return {
                items: state.items
            };
        case UPDATE_ITEM:
            return {
                ...state
            };
        default:
            return state;
    }
}