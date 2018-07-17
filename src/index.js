'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link} from 'react-router-dom';
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
            updated: false,
            incomingCall: null
        };

        this.abortControllers = [];
        this.getUsername = this.getUsername.bind(this);
        this.getFriendRequestsInfo = this.getFriendRequestsInfo.bind(this);
        this.getNumUnreadMessages = this.getNumUnreadMessages.bind(this);
        this.updateFriendshipRequestsInfo = this.updateFriendshipRequestsInfo.bind(this);
        this.updateNumUnreadMessages = this.updateNumUnreadMessages.bind(this);
        this.updateOnlineUsers = this.updateOnlineUsers.bind(this);
        this.cancelCall = this.cancelCall.bind(this);
        this.changeIncomingCallState = this.changeIncomingCallState.bind(this);
        this.deleteIcomingCallDialog = this.deleteIcomingCallDialog.bind(this);
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

    cancelCall(caller) {
        const obj = {
            caller,
            receiver: this.state.username,
            type: 'deny'
        };
        websocket.send('videoCall', obj);
        this.deleteIcomingCallDialog();
    }

    deleteIcomingCallDialog() {
        this.setState({incomingCall: null});
    }

    changeIncomingCallState(obj) {
        const { caller, type } = obj;
        let incomingCall;
        if (type == 'start') {
            incomingCall = { caller };
        }
        else incomingCall = null;
        this.setState({incomingCall});
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
            websocket.subscribe('videoCall', this.changeIncomingCallState)
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
        const { username, friendRequestsInfo, 
            numUnreadMessages, onlineUsers, incomingCall } = this.state;
        let incomingCallDialog = null;
        if (incomingCall) {
            incomingCallDialog = (
                <div>
                    <p>Вас вызывает {incomingCall.caller}</p>
                    <Link 
                        to={`/users/${username}/tryvideocall/${incomingCall.caller}/false`}
                        onClick={this.deleteIcomingCallDialog}>
                            Ответить
                    </Link>
                    <button 
                        type="button" 
                        onClick={() => this.cancelCall(incomingCall.caller)}>
                            Отклонить
                    </button>
                </div>
            );
        }
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
                {incomingCallDialog}
            </React.Fragment>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);