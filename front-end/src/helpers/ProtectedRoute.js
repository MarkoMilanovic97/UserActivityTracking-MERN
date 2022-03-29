import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';
import jwtDecode from 'jwt-decode';

function ProtectedRoute({ isAuth: isAuth, component: Component, ...rest }) {

    return (
        <Route {...rest} render={(props) => {
            if (isAuth) {
                return <Component />
            } else {
                if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy")) {
                    return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                } else if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")) {
                    return <Redirect to={{ pathname: '/welcome', state: { from: props.location } }} />
                } else if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")) {
                    return <Redirect to={{ pathname: '/users', state: { from: props.location } }} />
                }
            }
        }} />
    );
}

export default ProtectedRoute;