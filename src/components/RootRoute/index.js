'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import LoginForm from './LoginForm';
import UsersRoute from './UsersRoute';

export default function RootRoute (props) {

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
                            ? <UsersRoute
                                match={match} username={props.username} 
                                friendRequestsInfo={props.friendRequestsInfo} 
                                onlineUsers={props.onlineUsers}
                                />
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