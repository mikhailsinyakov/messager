'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Settings from './Settings';
import Search from './Search';
import UserInfoRoute from './UserInfoRoute';
import Friends from './Friends';

export default function UsersRoute(props) {
    const userInfoPath = `/users/${props.username}/info`;

    return (
        <React.Fragment>
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
                        <UserInfoRoute
                            match={match} 
                            username={props.username}
                            friendRequestsInfo={props.friendRequestsInfo}
                        />
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/friends'}
                    render={() => (
                        <Friends
                            username={props.username}
                            friendRequestsInfo={props.friendRequestsInfo}
                        />
                    )}
                />
                <Route 
                    render={() => <Redirect to={userInfoPath}/> }
                />
            </Switch>
        </React.Fragment>
    );
}