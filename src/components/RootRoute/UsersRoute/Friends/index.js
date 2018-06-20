'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import ChangeFriendStateBtn from '@src/components/common/ChangeFriendStateBtn'; 

import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class Friends extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userInfo: {}
        }

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
            getUserInfoPromises.push(userController.getUserInfo(username));
        });

        usersWaitingForAnswer.forEach(username => {
            getUserInfoPromises.push(userController.getUserInfo(username));
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

    render() {
        const { username, friendRequestsInfo } = this.props;
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

        const createFriendElem = (username, isFriend) => {
            (<div key={username}>
                <Link to={`/users/${username}/info`}>
                    <img src={`/public/photos/${username}-avatar.jpg`}
                        height={50}
                        onError={this.handleImgError} />
                </Link>
                <Link to={`/users/${username}/info`}>
                    {userInfo[username] 
                        ? <span> {userInfo[username]}</span> 
                        : <span>{username}</span>}
                </Link>
                {isFriend 
                    ?   <ChangeFriendStateBtn 
                            description="Убрать из друзей"
                            newFriendState="rejected"
                        />
                    :   <React.Fragment>
                            <ChangeFriendStateBtn 
                                description="Принять заявку"
                                newFriendState="wanted"
                            />
                            <ChangeFriendStateBtn 
                                description="Отклонить"
                                newFriendState="rejected"
                            />
                        </React.Fragment>
                }
            </div>);
        }

        const possibleFriendsElems = possibleFriends.map(username => {
            return createFriendElem(username, false);
        });

        const friendsElems = friends.map(username => {
            return createFriendElem(username, true);
        });
        
        return (
            <div id="friends">
                {possibleFriendsElems}
                {friendsElems}
            </div>
        )

    }
}

    