'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import ChangePhoto from './ChangePhoto';
import ChangePassword from './ChangePassword';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.avatarPath = `/public/photos/${this.props.username}-avatar.jpg`;
        this.placeholderPath = '/public/photos/placeholder.png';

        this.state = {
            imgSrc: `${this.avatarPath}?ver=${new Date().getTime()}`
        };

        this.handleImgError = this.handleImgError.bind(this);
        this.updateImg = this.updateImg.bind(this);
    }

    handleImgError() {
        this.setState({imgSrc: this.placeholderPath});
    }

    updateImg() {
        const imgSrc = `${this.avatarPath}?ver=${new Date().getTime()}`;
        this.setState({imgSrc});
    }

    render() {
        const { match, username } = this.props;
        const { params } = match;

        if (params.username != username) {
            return <Redirect to={`/users/${username}/info`} />;
        }

        return (
            <div className="settings">
                <div className="user-avatar-wrapper">
                    <img className="user-avatar" src={this.state.imgSrc} height={200} 
                        onError={this.handleImgError} />
                    <ChangePhoto updatePhoto={this.updateImg}/>
                </div>
                <ChangePassword username={username} />
            </div>
        );
    }
}