'use strict';

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import LoginForm from './LoginForm';
import UsersRoute from './UsersRoute';

export default class RootRoute extends React.Component {
    constructor(props) {
        super(props);
        this.mainRef = React.createRef();
        this.changeMarginOfMainElem = this.changeMarginOfMainElem.bind(this);
    }

    changeMarginOfMainElem() {
        const { headerHeight } = this.props;
        const mainElem = this.mainRef.current;
        mainElem.style.marginTop = headerHeight + 'px';
    }

    componentDidUpdate(prevProps) {
        if (prevProps.headerHeight != this.props.headerHeight) {
            this.changeMarginOfMainElem();
        }
    }

    render() {
        const { username, getUsername, friendRequestsInfo, onlineUsers, headerHeight } = this.props;
        const isLoggedIn = !!username;

        const userInfoPath = `/users/${username}/info`;

        const Entry = ({match}) => {
            return (
                isLoggedIn 
                    ? <Redirect to={userInfoPath} />
                    : <LoginForm pathUrl={match.url} getUsername={getUsername} />
            );
        };

        return (
            <main ref={this.mainRef}>
                <Switch>
                    <Route exact path='/login' render={Entry} />
                    <Route exact path='/signup' render={Entry} />
                    <Route 
                        path='/users' 
                        render={({match}) => (
                            isLoggedIn 
                                ? <UsersRoute
                                    match={match} username={username} 
                                    friendRequestsInfo={friendRequestsInfo} 
                                    onlineUsers={onlineUsers}
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
    
}