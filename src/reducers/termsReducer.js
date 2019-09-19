import { ADD_FETCHED_DATA } from '../actions/types';

export default function termsReducer(state = [], action) {
    switch (action.type) {

        case ADD_FETCHED_DATA:
            return [ ...action.payload];
        default:
            return state;
    }
}
