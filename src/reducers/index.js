import { combineReducers } from 'redux';
import termsReducer from './termsReducer';
import favoritesReducer from './favoritesReducer';

export default combineReducers({
    terms: termsReducer,
    favorites: favoritesReducer
});