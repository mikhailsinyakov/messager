'use strict';

import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import ChangeInfo from './ChangeInfo';

import RequestController from '../../app/controllers/requestController.client';

const requestController = new RequestController();

export default class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        requestController.sendRequest(`/api/users/${username}`)
            .then(this.addUserInfoToState)
            .catch(err => console.error('Network error'));
    }

    addUserInfoToState(data) {
        const userInfo = data.user;
        const {firstName = '', lastName = '', city = '', birthDate = '', 
            aboutYourself = ''} = userInfo;
        let {phoneNumber = ''} = userInfo;
        phoneNumber = this.toPrettierFormat(phoneNumber);

        this.setState({firstName, lastName, phoneNumber, 
                        city, birthDate, aboutYourself});
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

        const { match, username } = this.props;
        const {firstName, lastName, phoneNumber,
            city, birthDate, aboutYourself} = this.state;

        const userInfo = () => (
            <div>
                <img src={`/public/photos/${match.params.username}-avatar.jpg`}
                    height={200}
                    onError={e => e.target.src = '/public/photos/placeholder.png'}/>
                <p><b>Ник:</b> {match.params.username}</p>
                {firstName && <p><b>Имя:</b> {firstName}</p>}
                {lastName && <p><b>Фамилия:</b> {lastName}</p>}
                {phoneNumber && <p><b>Номер телефона:</b> {phoneNumber}</p>}
                {city && <p><b>Город:</b> {city}</p>}
                {birthDate && <p><b>Дата рождения:</b> {birthDate}</p>}
                {aboutYourself && <p><b>О себе:</b> {aboutYourself}</p>}
                {   
                    match.params.username == username
                    && <Link to={match.url + '/edit'}>Изменить</Link>
                }
            </div>
        );

        return (
            <div>
                <Switch>
                    <Route 
                        exact path={match.url}
                        render={userInfo}
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
            </div>
        );
         
    }
}