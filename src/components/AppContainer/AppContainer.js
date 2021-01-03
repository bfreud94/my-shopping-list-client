import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Header from '../Header/Header';
import AddItem from '../AddItem/AddItem';
import Login from '../Login/Login';
import ItemsList from '../ItemsList/ItemsList';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import './AppContainer.css';

class AppContainer extends Component {

    render() {
        return (
            <div className='app-container'>
                <Header />
                <div className='page-container'>
                    <Route exact path='/'>
                        <Redirect to='/login' />
                    </Route>
                    <Route exact path='/login' component={Login} />
                    <PrivateRoute exact path='/addItem' component={AddItem} />
                    <PrivateRoute exact path='/itemsList' component={ItemsList} />
                </div>
            </div>
        );
    }
}

export default AppContainer;
