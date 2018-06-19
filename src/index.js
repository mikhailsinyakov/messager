'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import UserController from '../app/controllers/userController.client';
import FriendshipController from '../app/controllers/friendshipController.client';

import Header from './components/Header';
import Main from './components/Main';

const userController = new UserController();
const friendshipController = new FriendshipController();

const app = document.querySelector('#app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            updated: false
        };

        this.addUserToState = this.addUserToState.bind(this);
        this.getUsername = this.getUsername.bind(this);
    }

    addUserToState(data) {
        if (data.status == 'Success') {
            const username = data.username ? data.username : null;
            this.setState({username});
        }
    }

    getUsername() {
        userController.getUsername()
            .then(this.addUserToState)
            .catch(err => console.error('Network error'));
    }

    componentDidMount() {
        this.getUsername();
    }


    componentWillUpdate() {
        if (!this.state.updated) {
            this.setState({updated: true});
        }
    }

    render() {
        if (!this.state.updated) {
            return null;
        }

        return (
            <div>
                <Header username={this.state.username} />
                <Main username={this.state.username} getUsername={this.getUsername}/>
            </div>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);