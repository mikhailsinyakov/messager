'use strict';

import React from 'react';
import FriendshipController from '@app/controllers/friendshipController.client';
import websocket from '@app/websocket/client';

const friendshipController = new FriendshipController();

export default class changeFriendStateBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { newFriendState, username, friendUsername, } = this.props;

        friendshipController.changeFriendshipState(username, friendUsername, newFriendState)
            .then(data => {
                if (data.status == 'Success') {
                    websocket.sendUsernamesWithChangedStatus(username, friendUsername);
                }
            }).catch(err => console.error('Network error'));
    }

    render() {
        return (
            <button type="button" onClick={this.handleClick}>
                {this.props.description}
            </button>
        );
    }
}