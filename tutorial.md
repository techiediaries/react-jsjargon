# A Guide to Redux with React

In this tutorial, we'll learn about many of Redux concepts by creating a simple React application from scratch. 

The application we'll be building is a simple JavaScript Jargon app that's based on the *Simplified JavaScript Jargon* available from this [repository](https://github.com/HugoGiraudel/SJSJ). We'll export the entries as JSON data and we'll consume it from our React application using Axios. State will be handled by Redux.   

For our demo application, We created a statically generated [JSON API](https://www.techiediaries.com/api/data.json) from the *Simplified JavaScript Jargon*  GitHub repository. 

> **Note**: If you are consuming any other resource, make sure you have CORS enabled so the browser doesn't disallow reading the remote resource due to the **Same Origin Policy**.

The app will also include a *favorites* page where you can add and delete your favorite JS terms from the jargon.

##  Introduction 

Redux is an implementation of the [Flux](https://facebook.github.io/flux/) pattern -  An application architecture for building user interfaces which is created and used by Facebook.

Redux is a library for managing the state of your application which is usually used with React, but it can also be used with other libraries and frameworks. It works by using a global state store common between all the components of the application.

Why Using Redux?

Redux is a good solution for medium and large apps which can help you handle complex state management requirements. But it's not needed in every use case.

For example, if you have components with many children and you want to pass state down the children tree, you can use the React Context API for accessing state in any component at any level without passing state to components that don't actually need it just because it's needed by a child component.

For more information, read [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) by Dan Abramov, the creator of Redux.

## Prerequisites

We will need a few prerequisites for this tutorial, such as:

- A recent version of Node.js and NPM installed on your system,
- A working knowledge of JavaScript and React,

If you have the previous prerequisites, let's get started with the first step where we'll install the `create-react-app` utility and create a React app.

## Step 1 — Installing Create-React-App & Initializing a React Application

In this step, we'll install the `create-react-app` utility, next we'll proceed to initializing our React project.

Open a new terminal and run the following command:

```bash
$ npm install -g create-react-app
```

> **Note**: You may need to add `sudo` before your command in Linux and macOS or use a CMD with administrator access if you want to install packages globally on your system. You can also simply fix your [npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).   

At the time of this writing **create-react-app v3.1.1** is installed.

Now, we are ready to create our React project. Head back to your terminal and run the following command:

```bash
$ cd ~
$ create-react-app javascriptjargon
```

Next, navigate inside your project's folder and run the following command to start the local develoment server:

```bash
$ cd ~/javascriptjargon
$ npm start
```

Your application will be available from the `http://localhost:3000` address.

In the next step, we'll install Axios, Redux, `react-redux` and `redux-thunk`.

## Step 2 — Installing Axios, Redux, React-redux and Redux-thunk

In the previous step, we have created our React project and served it locally. In this step, we'll install Axios, Redux, its React bindings and also redux-thunk.

Open a new terminal, navigate inside your project's folder and run the following command:

```bash
$ npm install --save redux react-redux redux-thunk
```

[Redux-thunk](https://github.com/reduxjs/redux-thunk) is a middleware that extends Redux to let you write asynchronous logic that interacts with the store. For example for fetching data from remote resources.

Next, wel also need to install Axios:

```bash
$ npm install axios --save
```

## Step 3 — Creating Redux Actions

According to official docs:

> Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using [store.dispatch()](https://redux.js.org/api/store#dispatchaction).


Actions are plain JavaScript objects that must have a type property which indicates the type of the action being performed. For example in our case, we can create an action of type `ADD_FAVORITE_TERM`:

```js
{  
 type: 'ADD_FAVORITE_TERM'
}
```

In most cases, an action can also include data:

```js
{  
  type:'ADD_FAVORITE_TERM',  
  name: 'Ajax'
}
```

In this example the event name is `ADD_FAVORITE_TERM` and the data is the name.

Inside the `src` folder, create a foler called `actions`:

```bash
$ cd src
$ mkdir actions
``` 

Next, navigate inside the `actions` folder and create a `types.js` file:

```bash
$ cd actions
$ touch types.js
```

Open the `types.js` file using your preferd code editor (We'll be using the nano editor):

```bash
$ nano types.js
```

Next, add the following constants and save the file:

```js
export const ADD_FAVORITE_TERM = 'ADD_FAVORITE_TERM';
export const REMOVE_FAVORITE_TERM = 'REMOVE_FAVORITE_TERM';
export const ADD_FETCHED_DATA = 'ADD_FETCHED_DATA';
```

Next, create an `index.js` file inside the `actions` folder:

```bash
$ touch index.js
```

Open the file using your code editor:

```bash
$ nano index.js
```

Next, start by adding the following code to the `index.js` file:

```js
import { ADD_FETCHED_DATA, ADD_FAVORITE_TERM, REMOVE_FAVORITE_TERM } from './types.js';
import axios from 'axios';
const apiUrl = 'https://www.techiediaries.com/api/data.json';
```

We imported our `ADD_FETCHED_DATA`, `ADD_FAVORITE_TERM`, and `REMOVE_FAVORITE_TERM` action types that we previously defined in the `actions/types.js` file. We also imported the `axios` client and defined the `apiUrl` constant variable which holds the URL of our JSON API.

Next, in the same `actions/index.js` file define the two following methods:

```js
export const addFavoriteTerm =  (data) => {
    return {
      type: ADD_FAVORITE_TERM,
      payload: {
        name: data.name,
        description: data.description
      }
    }
};

export const removeFavoriteTerm = name => {
    return {
      type: REMOVE_FAVORITE_TERM,
      payload: {
        name
      }
    }
}
```

These two methods are called action creators, 

[Action creators](https://redux.js.org/basics/actions#action-creators) are simply functions that create and return actions. 

We first defined the `addFavoriteTerm()` function that creates and returns an action of the `ADD_FAVORITE_TERM` type and provides the action with a data payload comprised of the name and description, passed as an argument to the function, of the JS term that users are adding to their favorites.

Next, we defined the `removeFavoriteTerm()` function that creates and returns an action of the `REMOVE_FAVORITE_TERM` type and `name` payload which refers to the name of the JS term that users want to remove from their favorites.

Now, we need to define a function that fetches data from the JSON API and dispatches an action of the `ADD_FETCHED_DATA` type with the fetched data as the payload as follows:

```js
export const fetchData = () => {
    return (dispatch) => {
        return axios.get(apiUrl)
            .then(response => {
                return response.data
            })
            .then(data => {
                dispatch({
                    type: ADD_FETCHED_DATA,
                    payload: data
                })
            })
            .catch(error => {
                throw (error);
            });
    };
};
```

Notice that this function is different from the previous functions (action creators) because it performs an asynchronous operation and returns a function, instead of an object, which has a passed `dispatch` argument.

This function is called a *thunk action creator*.

According to [Wikipedia](https://en.wikipedia.org/wiki/Thunk): 

>A thunk is a subroutine used to inject an additional calculation into another subroutine. Thunks are primarily used to delay a calculation until its result is needed, or to insert operations at the beginning or end of the other subroutine. They have a variety of other applications in compiler code generation and modular programming.

In the `fetchData()` thunk, we first return a function that takes a dispatch argument. In the body of the returned function we call the `get()` method of the axios client for sending a GET request to our JSON endpoint. Axios returns a JavaScript Promise which gets resolved with the fetched data or rejected with an error.

If the Promise is successfuly resolved, we send an action of the `ADD_FETCHED_DATA` type, along with the data fetched from the API as the payload, to the store using the passed `dipatch()` method. 

An action creator can return a function instead of an action object thanks to the [Redux Thunk middleware](https://github.com/gaearon/redux-thunk) which comes from the redux-thunk package we previously installed and which we'll add later to our Redux store.


Dispatching an action is simply sending the action to the Redux store. Typically, we dipatch actions from the UI following user reactions. In the case of asynchronous operations like network requests we can also dispatch actions from action creators.


That's all we need to define our actions. In the next step, we'll see how to use reducers to change the state of the application after dispatching actions.

## Step 4 — Creating Redux Reducers

In this step, we'll see what a reducer function is and we'll add reducers to our application.

[Reducers](https://redux.js.org/basics/reducers#reducers) are pure JavaScript functions that are used to set and update the application's state in response to actions sent to the store. 

Before writing the reducers, it's essential to thinck about the shape of your application's state. Redux stores the whole state as a single JavaScript object so you'll need to know the attributes of that object so you can write the required reducers. In our case, we need to store the followinf things:

- The array of JavaScript terms fetched from the JSON API,
- The array of the favorite JavaScript terms that the user has fovorited during the use of the application.


Head back to your terminal and, inside the `src/` folder, create a `reducers` folder and navigate to it using the following commands:

```bash
$ cd ..
$ mkdir reducers
$ cd reducers
```

Next, create the `index.js`, `termsReducer.js` and `favoritesReducer.js` files using the following commands:

```bash
$ touch index.js
$ touch termsReducer.js
$ touch favoritesReducer.js
```

Open the `reducers/termsReducer.js` file:

```bash
$ cd ..
$ nano reducers/termsReducer.js
```

Next, add the following code:

```js
import { ADD_FETCHED_DATA } from '../actions/types';

export default function termsReducer(state = [], action) {
    switch (action.type) {

        case ADD_FETCHED_DATA:
            return [ ...action.payload];
        default:
            return state;
    }
}
```

We first import the `ADD_FETCHED_DATA` action type and next we define and export a pure function that takes the old state and action and returns a new state depending on the type of action. In this case if the `ADD_FETCHED_DATA` action is sent we simply return a new state with the action payload (the array of data fetched from the JSON API).

Next, open the `reducers/favoritesReducer.js` file:

```bash
$ nano reducers/favoritesReducer.js
```

And add the following code:

```js
import { ADD_FAVORITE_TERM, REMOVE_FAVORITE_TERM } from '../actions/types';

export default function favoritesReducer(state = [], action) {
    switch (action.type) {
        case ADD_FAVORITE_TERM:
            return [...state, action.payload];
        case REMOVE_FAVORITE_TERM:
            return state.filter((e) => {
                if (e.name !== action.payload.name) {
                    return true;
                }
                return false;
            });
        default:
            return state;
    }
}
```

Again, we import the `ADD_FAVORITE_TERM` and `REMOVE_FAVORITE_TERM` action types, next we define and export a pure function that takes the old state and an action and returns a new state depending on the action. If the action type is `ADD_FAVORITE_TERM`, we create a new state comprised of the old state and the new favorite term sent with the action payload. If it's `REMOVE_FAVORITE_TERM`, we call the filter method on the state array to remove the term by name from the state. If none of these actions are sent, we return the old state.


We have now created reducers for mutating the state the various pieces of the global state of our application. We need to combine these reducers into one reducer using the [combineReducers()](https://redux.js.org/api/combinereducers) method. Open the `reducers/index.js` file:

```bash
$ nano reducers/index.js
```

Next, add the following code:  

```js
import { combineReducers } from 'redux';
import termsReducer from './termsReducer';
import favoritesReducer from './favoritesReducer';

export default combineReducers({
    terms: termsReducer,
    favorites: favoritesReducer
});
```

We first imported the `combineReducers()` method and our two reducers from their respectives files, Next we called the `combineReducers()` method by passing an object that takes the keys that will be used for each slice of our global state and assigns the required reducer.

The `combineReducers()` generates a function that calls the required reducer for each slice of the state, and combines their results into a single object.


For more detailed information about reducers, make sure to read [this page](https://redux.js.org/basics/reducers#reducers) of the official docs. 


In the next step, we'll see how to configure the Redux store in our application.

## Step 5 —  Creating the Redux Store

Now, that we have defined the actions and reducers in our application, we need to create the store 

Open the `src/index.js` file:

```bash
$ nano index.js 
```

Next, start by adding the following imports:

```js
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { fetchData } from './actions'
```

Next, create the store as follows and send the action for fetching data from the JSON API:


```js
const store = createStore(rootReducer, applyMiddleware(thunk));
store.dispatch(fetchData());
```


First, we created the store and applied the `redux-thunk` middleware to the store which allows us to support asynchronous actions in Redux.

Next, we dispatched our first action for fetching data from the server and storing it in the store. 

Next we need to pass the store to the components. In the same file, wrap the App component with the Provider component as follows 

```js
ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'));

```

We pass the store as a prop to `<Provider>`.

In the next step, we'll see how to create a React component for displaying our data.

## Step 6 — Creating the React Component

In this step, we'll create a `JargonList` component for displaysing the list of JS terminologies that you have consumed from the API. We'll also display the favorites terms selected by users in this same component and use conditional rendering to switch between the lists of terms and favorites.

Head back to your terminal and create a `JargonList.js` in the `src/` folder of your project:

```bash
$ touch JargonList.js 
```

Open the `JargonList.js` file:

```bash
$ nano JargonList.js
```

Next, start by adding the following imports:

```js
import React from 'react';
import { connect } from 'react-redux';
import { addFavoriteTerm, removeFavoriteTerm } from './actions';
```

Next, define the following method which will be used to map the state from the Redux store to component props:

```js
const mapStateToProps = state => {
    return {
        terms: state.terms,
        favorites: state.favorites
    };
};
```

Next, let's create the component as follows:

```js
class JargonList extends React.Component {

    state = {
        showFavorites: false
    }

    render() {
        if (this.state.showFavorites) {

            return (
                <div>
                    <h1>
                        JS Jargon
                    </h1>
                    <div>
                        <button onClick={() => { this.toggleJargon() }} > Show Jargon</button>
                    </div>
                    <div>
                        {this.props.favorites.map((term, index) => {
                            return (
                                <div key={index}>
                                    <h1> {term.name}</h1>
                                    <p> {term.description}</p>
                                    <button onClick={() => this.props.dispatch(removeFavoriteTerm(term.name))}>
                                        Remove from favorites
                                    </button>

                                </div>
                            );
                        })}                
                    </div>
                </div>
            )
        }
        else
            return (
                <div>
                    <h1>
                        JS Jargon
                    </h1>
                    <div>
                        <button onClick={() => { this.toggleFavorites() }} > Show Favorites</button>
                    </div>
                    {this.props.terms.map((term, index) => {
                        return (
                            <div key={index} >
                                <h1> {term.name} </h1>
                                <p> {term.description}</p>
                                <button onClick={() => this.props.dispatch(addFavoriteTerm({ name: term.name, description: term.description }))}>
                                    Add to favorites
                        </button>


                            </div>
                        );
                    })}

                </div>
            )
    }
}
```

Next, we need to define the following two methods in the `JargonList` class to toggle between the jargon and favorites views:

```js
    toggleFavorites() {
        this.setState({ showFavorites: true });
    }
    toggleJargon() {
        this.setState({ showFavorites: false });
    }
```

Finally, we need to connect the component to the Redux store and export it:

```js
export default connect(mapStateToProps, null)(JargonList);
```

The `connect()` method enables you to access the dispatch method as a prop by returning a new component with the dispatch method as its prop. 

Next, open the `src/App.js` file:

```bash
$ nano App.js
```

Next, update it as follows:

```js
import React from 'react';
import JargonList from './JargonList';


function App() {
  return (
      <JargonList />    
  );
}

export default App;
```

We simply included our `JargonList` component in our `App` component so it gets rendered when the app is started.

## Conclusion

In this tutorial we've seen step by step how we build a React application and manage its state using Redux.

You can find more information from the official docs of [React](https://reactjs.org/) and [Redux](https://redux.js.org/).