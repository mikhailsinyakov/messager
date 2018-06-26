'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import websocket from '@app/websocket/client';

import Header from './components/Header';
import RootRoute from './components/RootRoute';

import UserController from '@app/controllers/userController.client';
import FriendshipController from '@app/controllers/friendshipController.client';

const userController = new UserController();
const friendshipController = new FriendshipController();

const app = document.querySelector('#app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            friendRequestsInfo: {
                friendsList: [],
                followersList: [],
                usersIFollow: [],
                usersWaitingForAnswer: []
            },
            updated: false
        };

        this.abortControllers = [];
        this.getUsername = this.getUsername.bind(this);
        this.getFriendRequestsInfo = this.getFriendRequestsInfo.bind(this);
        this.updateFriendshipRequestsInfo = this.updateFriendshipRequestsInfo.bind(this);
    }

    getUsername() {
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.getUsername(signal)
            .then(data => {
                const { status, username } = data;
                if (status == 'Success') {
                    this.setState({username, updated: true});
                    if (username) {
                        websocket.createConnection();
                        websocket.sendUsername(username);
                    }
                }
                
            })
            .catch(err => {
                if (err.name == 'AbortError') {
                    return;
                }
                console.error('Network error');
            });
    }

    getFriendRequestsInfo() {
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        const username = this.state.username;
        friendshipController.getFriendRequestsInfo(username, signal)
            .then(this.updateFriendshipRequestsInfo)
            .catch(err => {
                if (err.name == 'AbortError') {
                    return;
                }
                console.error('Network error');
            });
    }

    updateFriendshipRequestsInfo(data) {
        if (data.status == 'Success') {
            const { friendRequestsInfo } = data;
            this.setState({friendRequestsInfo});
        }
    }

    componentDidMount() {
        this.getUsername();
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
        websocket.close();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.username != this.state.username) {
            this.getFriendRequestsInfo();
            websocket.friendshipStatusChanged(this.getFriendRequestsInfo);
        }
    }

    render() {
        if (!this.state.updated) {
            return null;
        }
        return (
            <React.Fragment>
                <Header 
                    username={this.state.username}
                    friendRequestsInfo={this.state.friendRequestsInfo}
                />
                <RootRoute
                    username={this.state.username}
                    getUsername={this.getUsername}
                    friendRequestsInfo={this.state.friendRequestsInfo}
                />
            </React.Fragment>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);