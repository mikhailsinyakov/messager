'use strict';

import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import UserInfo from './UserInfo';
import ChangeInfo from './ChangeInfo';
import FriendState from './FriendState'; 

import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class UserInfoRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gotUserInfo: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            city: '',
            birthDate: '',
            aboutYourself: ''
        };
        
        this.abortControllers = [];
        this.getUserInfo = this.getUserInfo.bind(this);
        this.addUserInfoToState = this.addUserInfoToState.bind(this);
        this.toPrettierFormat = this.toPrettierFormat.bind(this);
    }

    getUserInfo() {
        const username = this.props.match.params.username;
        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.getUserInfo(username, signal)
            .then(this.addUserInfoToState)
            .catch(err => console.error('Network error'));
    }

    addUserInfoToState(data) {
        const userInfo = data.user;
        const {firstName = '', lastName = '', city = '', birthDate = '', 
            aboutYourself = ''} = userInfo;
        let {phoneNumber = ''} = userInfo;
        phoneNumber = this.toPrettierFormat(phoneNumber);
        const gotUserInfo = true;

        this.setState({firstName, lastName, phoneNumber, 
                        city, birthDate, aboutYourself, gotUserInfo});
    }

    toPrettierFormat(phoneNumber) {
        if (!phoneNumber) {
            return '';
        }

        const phoneNumStr = phoneNumber.toString();

        const area = phoneNumStr.slice(0, 3);
        const group1 = phoneNumStr.slice(3, 6);
        const group2 = phoneNumStr.slice(6, 8);
        const group3 = phoneNumStr.slice(8, 10);

        return `+7 (${area}) ${group1}-${group2}-${group3}`;
    }

    componentDidMount() {
        this.getUserInfo();
    }
    
    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {

        if (!this.state.gotUserInfo) return null;

        const { match, username, friendRequestsInfo, onlineUsers } = this.props;
        const { params: { username: friendUsername } } = match;
        const {firstName, lastName, phoneNumber,
            city, birthDate, aboutYourself} = this.state;
        const { friendsList } = friendRequestsInfo;

        const isUserOnline = (() => !!onlineUsers.filter(user => user == friendUsername).length)();
        const isFriend = friendsList.includes(friendUsername);
        let makeVideoCallLink = null;
        if (isUserOnline && isFriend) {
            makeVideoCallLink = (
                <Link to={`/users/${username}/tryvideocall/${friendUsername}/true`}>
                    <button type="button">
                        Сделать видеозвонок
                    </button>
                </Link>
            );
        }

        const ActionButtons = () => (
            <React.Fragment>
                <FriendState 
                    username={username}
                    friendUsername={friendUsername}
                    friendRequestsInfo={friendRequestsInfo}
                />
                <Link to={`/users/${username}/dialogs/${friendUsername}`}>
                    <button type="button">
                        Написать сообщение
                    </button>
                </Link>
                {makeVideoCallLink}
            </React.Fragment>
        );

        const showUserInfo = () => (
            <React.Fragment>
                <UserInfo 
                    firstName={firstName}
                    lastName={lastName}
                    phoneNumber={phoneNumber}
                    city={city}
                    birthDate={birthDate}
                    aboutYourself={aboutYourself}
                    username={friendUsername}
                    isUserOnline={isUserOnline}
                />
                {
                    friendUsername == username
                        ? <Link to={match.url + '/edit'}>Изменить</Link>
                        : <ActionButtons/>
                }
            </React.Fragment>
        );

        const showEditingInfo = () => (
            <ChangeInfo username={username}
                matchedUsername={friendUsername}
                infoState={this.state}
                getUserInfo={this.getUserInfo} 
                addUserInfoToState={this.addUserInfoToState}
                toPrettierFormat={this.toPrettierFormat}
            />
        );

        return (
            <Switch>
                <Route 
                    exact path={match.url}
                    render={showUserInfo}
                />
                <Route  
                    exact path={match.url + '/edit'}
                    render={showEditingInfo}
                />
                <Route render={() => <Redirect to={match.url}/>} />
            </Switch>
        );
         
    }
}