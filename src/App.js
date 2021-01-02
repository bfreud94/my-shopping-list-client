import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import AddItem from './components/AddItem/AddItem';
import Login from './components/Login/Login';
import ShoppingList from './components/ShoppingList/ShoppingList';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import store from './store';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Header />
                    <Route exact path='/'>
                        <Redirect to='/login' />
                    </Route>
                    <Route exact path='/login' component={Login} />
                    <PrivateRoute exact path='/addItem' component={AddItem} />
                    <PrivateRoute exact path='/shoppingList' component={ShoppingList} />
                </Router>
            </Provider>
        );
    }
}

export default App;