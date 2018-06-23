'use strict';

import React from 'react';
import ChangeFriendState from '@src/components/common/ChangeFriendStateBtn';

export default function FriendState (props) {
    const { username, friendUsername, friendRequestsInfo, 
        websocket } = props;
    const { friendsList, followersList, usersIFollow } = friendRequestsInfo;

    function ChangeFriendStateProto(props) {
        const { description, newFriendState } = props;
        return (
            <ChangeFriendState 
                description={description}
                newFriendState={newFriendState}
                username={username}
                friendUsername={friendUsername}
            />
        );
    }

    if (friendsList.includes(friendUsername)) {
        return (
            <div>
                <p>Вы друзья</p>
                <ChangeFriendStateProto 
                    description="Убрать из друзей" newFriendState="rejected"
                />
            </div>
        );
    }
    else if (followersList.includes(friendUsername)) {
        return (
            <div>
                <p>{friendUsername} подписан на Вас</p>
                <ChangeFriendStateProto 
                    description="Добавить в друзья" newFriendState="wanted"
                />
            </div>
        );
    }
    else if (usersIFollow.includes(friendUsername)) {
        return (
            <div>
                <p>Вы подписаны на {friendUsername}</p>
                <ChangeFriendStateProto 
                    description="Отозвать заявку" newFriendState="rejected"
                />
            </div>
        );
    }
    else {
        return (
            <div>
                <ChangeFriendStateProto 
                    description="Добавить в друзья" newFriendState="wanted"
                />
            </div>
        );
    }
}