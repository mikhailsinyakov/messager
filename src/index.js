'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import RequestController from '../app/controllers/requestController.client';
import Header from './components/Header';
import Main from './components/Main';

const requestController = new RequestController();
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

        this.testFetch = this.testFetch.bind(this);
    }

    addUserToState(data) {
        if (data.status == 'Success') {
            const username = data.username ? data.username : null;
            this.setState({username});
        }
    }

    getUsername() {
        requestController.sendRequest('/api/users/current?onlyUsername=true')
            .then(this.addUserToState)
            .catch(err => console.error('Network error'));
    }

    testFetch() {
        requestController.testRequest()
            .then(data => console.log(data))
            .catch(err => console.error('error'))
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

        return (
            <div>
                <Header username={this.state.username} updated={this.state.updated}/>
                <Main username={this.state.username} getUsername={this.getUsername}
                        updated={this.state.updated}/>
                <button type="button" onClick={this.testFetch}>Test fetch</button>
            </div>
        );
    }
    
}

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), app);