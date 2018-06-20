'use strict';

import React from 'react';
import ChangeFriendState from './ChangeFriendStateBtn';

export default function FriendState (props) {
    const { username, friendRequestsInfo } = props;
    const { friendsList, followersList, usersIFollow } = friendRequestsInfo;

    if (friendsList.includes(username)) {
        return (
            <div>
                <p>Вы друзья</p>
                <ChangeFriendState 
                    description="Убрать из друзей"
                    newFriendState="rejected"
                />
            </div>
        );
    }
    else if (followersList.includes(username)) {
        return (
            <div>
                <p>{username} подписан на Вас</p>
                <ChangeFriendState 
                    description="Добавить в друзья"
                    newFriendState="wanted"
                />
            </div>
        );
    }
    else if (usersIFollow.includes(username)) {
        return (
            <div>
                <p>Вы подписаны на {username}</p>
                <ChangeFriendState 
                    description="Отозвать заявку"
                    newFriendState="rejected"
                />
            </div>
        );
    }
    else {
        return (
            <div>
                <ChangeFriendState 
                    description="Добавить в друзья"
                    newFriendState="wanted"
                />
            </div>
        );
    }
}