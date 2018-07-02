'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import UserController from '@app/controllers/userController.client';

const userController = new UserController();

export default class ChangeInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.props.infoState;

        this.abortControllers = [];
        this.checkValueThroughRegExp = this.checkValueThroughRegExp.bind(this);
        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    checkValueThroughRegExp(value, regex) {
        if (value) {
            if (value[0].toUpperCase) {
                value = value[0].toUpperCase() + value.slice(1);
            }
            value = regex.exec(value)[0];
        }
        return value;
    }

    validatePhoneNumber(phoneNumber) {
        if (!phoneNumber) return phoneNumber;
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (phoneNumber[0] == '7' || phoneNumber[0] == '8') {
            phoneNumber = phoneNumber.slice(1);
        }
        phoneNumber = phoneNumber.substr(0, 10);
        return +phoneNumber;
    }

    handleInput(target, regex) {
        let value = target.value;
        if (regex) value = this.checkValueThroughRegExp(value, regex);
        const propertyName = target.name;
        this.setState({[propertyName]: value});
    }

    handleSubmit(e) {
        const userInfo = this.state;
        userInfo.phoneNumber = this.validatePhoneNumber(userInfo.phoneNumber);

        const controller = new AbortController();
        const { signal } = controller;
        this.abortControllers.push(controller);
        userController.changeUserInfo(userInfo, signal)
            .then(data => {
                if (data.status == 'Success') {
                    this.props.getUserInfo();
                }
            }).catch(err => console.error('Network error'));
    }

    componentWillUnmount() {
        this.abortControllers.forEach(controller => controller.abort());
    }

    render() {
        const properNameRegex = /[A-ZА-Яa-zа-я\-]*/;
        const phoneNumberRegex = /[\d\-\(\)\+\s]*/;

        const { username, matchedUsername } = this.props;
        const { firstName, lastName, phoneNumber, 
            city, birthDate, aboutYourself } = this.state;

        if (matchedUsername != username) {
            return <Redirect to={`/users/${username}/info`} />;
        }

        return (
            <form id="changeInfo">
                <label>Ник: 
                    <input type="text" name="username" value={username}
                            readOnly autoComplete="username"/>
                </label><br/>
                <label>Имя: 
                    <input type="text" name="firstName" value={firstName}
                            autoComplete="given-name"
                            onChange={e => this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Фамилия: 
                    <input type="text" name="lastName" value={lastName}
                            autoComplete="family-name"
                            onChange={e => this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Номер телефона: 
                    <input type="tel" name="phoneNumber" value={phoneNumber}
                            autoComplete="tel-national"
                            onFocus={this.addFirstCharsIfNumberIsEmpty}
                            onChange={e => this.handleInput(e.target, phoneNumberRegex)} />
                </label><br/>
                <label>Город: 
                    <input type="text" name="city" value={city}
                            autoComplete="address-level2"
                            onChange={e => this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Дата рождения: 
                    <input type="date" name="birthDate" value={birthDate}
                            autoComplete="bday"
                            onChange={e => this.handleInput(e.target)} />
                </label><br/>
                <label>О себе: 
                    <textarea name="aboutYourself" value={aboutYourself}
                        onChange={e => this.handleInput(e.target)}>
                    </textarea>
                </label><br/>
                <button type="button" onClick={this.handleSubmit}>
                    Сохранить изменения
                </button>
            </form>
        );
    }
}