'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import LoginForm from './LoginForm';
import Users from './Users';

export default function Main (props) {

    const isLoggedIn = !!props.username;

    const userInfoPath = `/users/${props.username}/info`;

    const Entry = ({match}) => {
        return (
            isLoggedIn 
                ? <Redirect to={userInfoPath} />
                : <LoginForm pathUrl={match.url} getUsername={props.getUsername} />
        );
    };

    return (
        <main>
            <Switch>
                <Route exact path='/login' render={Entry} />
                <Route exact path='/signup' render={Entry} />
                <Route 
                    path='/users' 
                    render={({match}) => (
                        isLoggedIn 
                            ? <Users match={match} username={props.username} />
                            : <Redirect to='/login'/>
                    )} 
                />
                <Route
                    render={() => (
                        isLoggedIn 
                            ? <Redirect to={userInfoPath}/> 
                            : <Redirect to='/login'/>
                    )} 
                />
            </Switch>
        </main>
    );
}