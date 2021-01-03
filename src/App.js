import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContainer from './components/AppContainer/AppContainer';
import store from './store';
import './App.css';

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Fragment>
                        <AppContainer />
                    </Fragment>
                </Router>
            </Provider>
        );
    }
}

export default App;