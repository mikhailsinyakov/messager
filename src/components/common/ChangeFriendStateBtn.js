'use strict';

import React from 'react';
import FriendshipController from '@app/controllers/friendshipController.client';
import websocket from '@app/websocket/client';

const friendshipController = new FriendshipController();

export default class changeFriendStateBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.abortControllers = [];
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {
        const { newFriendState, username, friendUsername, } = this.props;
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);

        friendshipController.changeFriendshipState(username, friendUsername, newFriendState, signal)
            .then(data => {
                if (data.status == 'Success') {
                    websocket.sendUsernamesWithChangedStatus(username, friendUsername);
                }
            }).catch(err => console.error('Network error'));
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        return (
            <button type="button" onClick={this.handleClick}>
                {this.props.description}
            </button>
        );
    }
}