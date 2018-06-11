'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Settings from './Settings';
import Search from './Search';
import UserInfo from './UserInfo';

export default function Users(props) {
    const userInfoPath = `/users/${props.username}/info`;

    return (
        <div>
            <Switch>
                <Route
                    exact path={props.match.url}
                    component={Search}
                />
                <Route 
                    exact path={props.match.url + '/:username/settings'}
                    render={({match}) => (
                        <Settings match={match} username={props.username}/>
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/info'}
                    render={({match}) => (
                        <UserInfo match={match} username={props.username}/>
                    )}
                />
                <Route 
                    render={() => <Redirect to={userInfoPath}/> }
                />
            </Switch>
        </div>
    );
}