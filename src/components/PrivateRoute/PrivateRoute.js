import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({
    component: Component,
    ...props
}) => (
    /* eslint-disable react/jsx-first-prop-new-line, react/jsx-props-no-spreading, react/jsx-max-props-per-line, no-shadow */
    <Route {...props} component={(props) => (
        localStorage.getItem('token') ? (
            <Component {...props} />
        ) : (
            <Redirect to="/" />
        )
    )}
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.objectOf(PropTypes.any).isRequired
};

export default PrivateRoute;