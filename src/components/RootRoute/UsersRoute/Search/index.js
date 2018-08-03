'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            users: []
        };

        this.abortControllers = [];
        this.handleInput = this.handleInput.bind(this);
        this.handleSearchResults = this.handleSearchResults.bind(this);
        this.handleImgError = this.handleImgError.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInput(e) {
        const value = e.target.value;
        this.setState({query: value});
    }

    handleSearchResults() {
        const query = this.state.query;
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.getSearchResults(query, signal)
            .then(data => this.setState({users: data.users}))
            .catch(err => console.error('Network error'));
    }

    handleImgError(e) {
        e.target.src = '/public/photos/placeholder.png';
    }

    handleClick(url) {
        window.location.href = url;
    }

    componentDidMount() {
        this.handleSearchResults();
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.query != prevState.query) this.handleSearchResults();
    }

    render() {
        const { onlineUsers } = this.props;
        const checkUserOnline = username => !!onlineUsers.filter(user => user == username).length;
        const onlineText = username => checkUserOnline(username) ? '(Online)' : '';

        const users = this.state.users.map((val, i) => (
            <div key={i} className="user-item" 
                onClick={() => this.handleClick(`/users/${val.username}/info`)}> 
                <img src={`/public/photos/${val.username}-avatar.jpg`}
                    className="user-avatar"
                    onError={this.handleImgError} />
                <span className="username">
                    {val.firstName &&  val.lastName 
                        ? `${val.firstName} ${val.lastName} ${onlineText(val.username)}`
                        : `${val.username} ${onlineText(val.username)}`}
                </span>
            </div>
        ));

        return (
            <div className="search">
                <input type="text" name="query" placeholder="Введите запрос"
                    onChange={this.handleInput} value={this.state.query} />
                <div className="users">
                    {users}
                </div>
            </div>
        );
    }
}