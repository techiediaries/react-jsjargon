import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import { fetchData } from './actions';


const saveState = (state) => {
  if(state.favorites.length !== 0){
    localStorage.setItem("state", JSON.stringify(state));
  }
};

const getState = () => {
  console.log("get unitial state!!!");
  try{
    const s = localStorage.getItem("state");
    
    console.log("Getting state, ",s);
    if (s  === null) return undefined;
    return JSON.parse(s);
  }catch(e){
    return undefined;
  }
};

const initialState = getState();
const store = createStore(rootReducer,initialState, applyMiddleware(thunk));
store.dispatch(fetchData());

store.subscribe(()=>{
  saveState({
    favorites: store.getState().favorites   
  })
})




ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'));

    
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
