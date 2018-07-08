'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import websocket from '@app/websocket/client';

import Header from './components/Header';
import RootRoute from './components/RootRoute';

import UserController from '@app/controllers/userController.client';
import FriendshipController from '@app/controllers/friendshipController.client';
import DialogController from '@app/controllers/dialogController.client';

const userController = new UserController();
const friendshipController = new FriendshipController();
const dialogController = new DialogController();

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
            numUnreadMessages: 0,
            onlineUsers: [],
            updated: false
        };

        this.abortControllers = [];
        this.getUsername = this.getUsername.bind(this);
        this.getFriendRequestsInfo = this.getFriendRequestsInfo.bind(this);
        this.getNumUnreadMessages = this.getNumUnreadMessages.bind(this);
        this.updateFriendshipRequestsInfo = this.updateFriendshipRequestsInfo.bind(this);
        this.updateNumUnreadMessages = this.updateNumUnreadMessages.bind(this);
        this.updateOnlineUsers = this.updateOnlineUsers.bind(this);
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
                        websocket.create();
                        websocket.send('username', { username });
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

    getNumUnreadMessages() {
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        const { username } = this.state;
        dialogController.getNumUnreadMessages(username, signal)
            .then(this.updateNumUnreadMessages)
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

    updateNumUnreadMessages(data) {
        if (data.status == 'Success') {
            const { number } = data;
            this.setState({numUnreadMessages: number});
        }
    }

    updateOnlineUsers(data) {
        const { onlineUsers } = data;
        this.setState({ onlineUsers });
    }

    componentDidMount() {
        this.getUsername();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.username != this.state.username) {
            this.getFriendRequestsInfo();
            this.getNumUnreadMessages();
            websocket.subscribe('friendshipStatus', this.getFriendRequestsInfo);
            websocket.subscribe('newMessage', this.getNumUnreadMessages);
            websocket.subscribe('newMessageStatus', this.getNumUnreadMessages);
            websocket.subscribe('onlineUsersChanged', this.updateOnlineUsers);
        }
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
        websocket.close();
    }


    render() {
        if (!this.state.updated) {
            return null;
        }
        const { username, friendRequestsInfo, numUnreadMessages, onlineUsers } = this.state;
        return (
            <React.Fragment>
                <Header 
                    username={username}
                    friendRequestsInfo={friendRequestsInfo}
                    numUnreadMessages={numUnreadMessages}
                />
                <RootRoute
                    username={username}
                    getUsername={this.getUsername}
                    friendRequestsInfo={friendRequestsInfo}
                    onlineUsers={onlineUsers}
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