import React from 'react';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            photo: '',
            city: '',
            birthDate: '',
            aboutYourself: ''
        };

        this.getUserInfo = this.getUserInfo.bind(this);
        this.addUserInfoToState = this.addUserInfoToState.bind(this);
        this.checkValueThroughRegExp = this.checkValueThroughRegExp.bind(this);
        this.toPrettierFormat = this.toPrettierFormat.bind(this);
        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getUserInfo() {
        this.props.sendGetRequest(`/api/users/current`)
            .then(this.addUserInfoToState)
            .catch(err => console.error(err));
    }

    addUserInfoToState(userInfo) {
        userInfo = JSON.parse(userInfo);
        const {firstName = '', lastName = '', photo = '', 
                city = '', birthDate = '', aboutYourself = ''} = userInfo;
        let {phoneNumber = ''} = userInfo;
        phoneNumber = this.toPrettierFormat(phoneNumber);
        this.setState({firstName, lastName, phoneNumber, 
                        photo, city, birthDate, aboutYourself});
    }

    toPrettierFormat(phoneNumber) {
        if (!phoneNumber) {
            return phoneNumber;
        }

        const phoneNumStr = phoneNumber.toString();

        const area = phoneNumStr.slice(0, 3);
        const group1 = phoneNumStr.slice(3, 6);
        const group2 = phoneNumStr.slice(6, 8);
        const group3 = phoneNumStr.slice(8, 10);

        return `+7 (${area}) ${group1}-${group2}-${group3}`;
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
        const newPropsObj = this.state;
        delete newPropsObj.photo;
        newPropsObj.phoneNumber = this.validatePhoneNumber(newPropsObj.phoneNumber);

        const body = JSON.stringify(newPropsObj)

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');


        const action = '/api/users/current';
        const options = {
            method: 'PATCH',
            body,
            headers: myHeaders,
            credentials: 'same-origin'
        };

        fetch(action, options)
            .then(response => response.text())
            .then(response => {
                this.getUserInfo();
            })
            .catch(err => console.error(err));
    }

    componentDidMount() {
        this.getUserInfo();
    }

    render() {
        const properNameRegex = /[A-ZА-Яa-zа-я\-]*/;
        const phoneNumberRegex = /[\d\-\(\)\+\s]*/;
        return (
            <form id="settings">
                <label>Ник: 
                    <input type="text" name="username" value={this.props.username}
                            readOnly autoComplete="username"/>
                </label><br/>
                <label>Имя: 
                    <input type="text" name="firstName" value={this.state.firstName}
                            autoComplete="given-name"
                            onChange={e => 
                                this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Фамилия: 
                    <input type="text" name="lastName" value={this.state.lastName}
                            autoComplete="family-name"
                            onChange={e => 
                                this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Номер телефона: 
                    <input type="tel" name="phoneNumber" value={this.state.phoneNumber}
                            autoComplete="tel-national"
                            onFocus={this.addFirstCharsIfNumberIsEmpty}
                            onChange={e => 
                                this.handleInput(e.target, phoneNumberRegex)} />
                </label><br/>
                <label>Город: 
                    <input type="text" name="city" value={this.state.city}
                            autoComplete="address-level2"
                            onChange={e => 
                                this.handleInput(e.target, properNameRegex)} />
                </label><br/>
                <label>Дата рождения: 
                    <input type="date" name="birthDate" value={this.state.birthDate}
                            autoComplete="bday"
                            onChange={e => 
                                this.handleInput(e.target)} />
                </label><br/>
                <label>О себе: 
                    <textarea name="aboutYourself" value={this.state.aboutYourself}
                        onChange={e => 
                            this.handleInput(e.target)}>
                    </textarea>
                </label><br/>
                <button type="button" onClick={this.handleSubmit}>
                    Сохранить изменения
                </button>
            </form>
        )
    }
}