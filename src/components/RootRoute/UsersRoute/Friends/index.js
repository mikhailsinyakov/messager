'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import ChangeFriendState from '@src/components/common/ChangeFriendStateBtn'; 

import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class Friends extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userInfo: {}
        }

        this.abortControllers = [];
        this.handleImgError = this.handleImgError.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }
    
    handleImgError(e) {
        e.target.src = '/public/photos/placeholder.png';
    }

    updateUserInfo(userInfo) {
        this.setState({userInfo});
    }

    componentDidMount() {
        const { friendRequestsInfo } = this.props;
        const { friendsList, usersWaitingForAnswer } = friendRequestsInfo;
        const getUserInfoPromises = [];

        friendsList.forEach(username => {
            const controller = new AbortController();
            const { signal } = controller;
            this.abortControllers.push(controller);
            getUserInfoPromises.push(userController.getUserInfo(username, signal));
        });

        usersWaitingForAnswer.forEach(username => {
            const controller = new AbortController();
            const { signal } = controller;
            this.abortControllers.push(controller);
            getUserInfoPromises.push(userController.getUserInfo(username, signal));
        });

        Promise.all(getUserInfoPromises)
            .then(userInfo => {
                userInfo = userInfo.filter(userData => {
                    return userData.user.firstName && userData.user.lastName;
                });
                const userInfoObj = {};
                userInfo.forEach(userData => {
                    const { user } = userData;
                    userInfoObj[user.username] = `${user.firstName} ${user.lastName}`;
                });

                this.updateUserInfo(userInfoObj);
            }).catch(err => console.error('Network error'));
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const { username, friendRequestsInfo, 
            websocket } = this.props;
        const { userInfo } = this.state;

        const { 
            friendsList: friends,
            usersWaitingForAnswer: possibleFriends
        } = friendRequestsInfo;

        if (!friends.length && !possibleFriends.length) {
            return (
                <div>
                    <p>У Вас пока нет друзей</p>
                </div>
            );
        }

        function ChangeFriendStateProto(props) {
            const { description, newFriendState, friendUsername } = props;
            return (
                <ChangeFriendState 
                    description={description}
                    newFriendState={newFriendState}
                    friendUsername={friendUsername}
                    username={username}
                />
            );
        }

        const createFriendElem = (friendUsername, isFriend) => (
            <div key={friendUsername}>
                <Link to={`/users/${friendUsername}/info`}>
                    <img src={`/public/photos/${friendUsername}-avatar.jpg`}
                        height={50}
                        onError={this.handleImgError} />
                </Link>
                <Link to={`/users/${friendUsername}/info`}>
                    {userInfo[friendUsername] 
                        ? <span> {userInfo[friendUsername]}</span> 
                        : <span>{friendUsername}</span>}
                </Link>
                {isFriend 
                    ?   <ChangeFriendStateProto 
                            description="Убрать из друзей" newFriendState="rejected"
                            friendUsername={friendUsername}
                        />
                    :   <React.Fragment>
                            <ChangeFriendStateProto 
                                description="Принять заявку" newFriendState="wanted"
                                friendUsername={friendUsername} 
                            />
                            <ChangeFriendStateProto 
                                description="Отклонить" newFriendState="rejected"
                                friendUsername={friendUsername}
                            />
                        </React.Fragment>
                }
            </div>
        );

        const possibleFriendsElems = possibleFriends.map(friendUsername => {
            return createFriendElem(friendUsername, false);
        });

        const friendsElems = friends.map(friendUsername => {
            return createFriendElem(friendUsername, true);
        });
        
        return (
            <div id="friends">
                {possibleFriendsElems}
                {friendsElems}
            </div>
        )

    }
}

    