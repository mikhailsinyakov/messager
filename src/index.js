'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import UserController from '../app/controllers/userController.client';
import FriendshipController from '../app/controllers/friendshipController.client';

import Header from './components/Header';
import RootRoute from './components/RootRoute';

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

        this.getUsername = this.getUsername.bind(this);
        this.addUserToState = this.addUserToState.bind(this);
        this.getFriendRequestsInfo = this.getFriendRequestsInfo.bind(this);
        this.updateFriendshipRequestsInfo = this.updateFriendshipRequestsInfo.bind(this);
    }

    getUsername() {
        userController.getUsername()
            .then(this.addUserToState)
            .catch(err => console.error('Network error'));
    }

    addUserToState(data) {
        if (data.status == 'Success') {
            const username = data.username ? data.username : null;
            this.setState({username, updated: true});
        }
    }

    getFriendRequestsInfo() {
        const username = this.state.username;
        friendshipController.getFriendRequestsInfo(username)
            .then(this.updateFriendshipRequestsInfo)
            .catch(err => console.error('Network error'));
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.updated != this.state.updated) {
            this.getFriendRequestsInfo();
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