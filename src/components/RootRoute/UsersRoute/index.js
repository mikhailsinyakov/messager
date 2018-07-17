'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Settings from './Settings';
import Search from './Search';
import UserInfoRoute from './UserInfoRoute';
import Friends from './Friends';
import DialogsRoute from './DialogsRoute';
import TryVideoCall from './TryVideoCall';
import VideoCall from './VideoCall';

export default function UsersRoute(props) {
    const userInfoPath = `/users/${props.username}/info`;

    return (
        <React.Fragment>
            <Switch>
                <Route
                    exact path={props.match.url}
                    render={() => <Search onlineUsers={props.onlineUsers} />}
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
                            onlineUsers={props.onlineUsers}
                        />
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/friends'}
                    render={() => (
                        <Friends
                            username={props.username}
                            friendRequestsInfo={props.friendRequestsInfo}
                            onlineUsers={props.onlineUsers}
                        />
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/dialogs'}
                    render={({match}) => (
                        <DialogsRoute 
                            match={match} username={props.username} 
                        />
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/tryvideocall/:friendUsername/:isCaller'}
                    render={({match}) => ( 
                        <TryVideoCall 
                            match={match} username={props.username} 
                        /> 
                    )}
                />
                <Route 
                    path={props.match.url + '/:username/videocall/:friendUsername'}
                    render={({match}) => ( 
                        <VideoCall 
                            match={match} username={props.username} 
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