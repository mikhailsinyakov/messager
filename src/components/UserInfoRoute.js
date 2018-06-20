'use strict';

import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import UserInfo from './UserInfo';
import ChangeInfo from './ChangeInfo';
import FriendState from './FriendState'; 

import UserController from '../../app/controllers/userController.client';

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
        this.getUserInfo = this.getUserInfo.bind(this);
        this.addUserInfoToState = this.addUserInfoToState.bind(this);
        this.toPrettierFormat = this.toPrettierFormat.bind(this);
    }

    getUserInfo() {
        const username = this.props.match.params.username;
        userController.getUserInfo(username)
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

    render() {

        if (!this.state.gotUserInfo) {
            return null;
        }

        const { match, username, friendRequestsInfo } = this.props;
        const {firstName, lastName, phoneNumber,
            city, birthDate, aboutYourself} = this.state;

        return (
            <React.Fragment>
                <Switch>
                    <Route 
                        exact path={match.url}
                        render={() => (
                            <React.Fragment>
                                <UserInfo 
                                    firstName={firstName}
                                    lastName={lastName}
                                    phoneNumber={phoneNumber}
                                    city={city}
                                    birthDate={birthDate}
                                    aboutYourself={aboutYourself}
                                    username={match.params.username}
                                />
                                {
                                    match.params.username == username
                                        ? <Link to={match.url + '/edit'}>Изменить</Link>
                                        : <FriendState 
                                            username={username}
                                            friendRequestsInfo={friendRequestsInfo}
                                        />
                                }
                            </React.Fragment>
                        )}
                    />
                    <Route  
                        exact path={match.url + '/edit'}
                        render={() => (
                            <ChangeInfo username={username}
                                matchedUsername={match.params.username}
                                infoState={this.state}
                                getUserInfo={this.getUserInfo} 
                                addUserInfoToState={this.addUserInfoToState}
                                toPrettierFormat={this.toPrettierFormat}
                            />
                        )}
                    />
                    <Route render={() => <Redirect to={match.url}/>} />
                </Switch>
            </React.Fragment>
        );
         
    }
}