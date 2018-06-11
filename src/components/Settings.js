'use strict';

import React from 'react';
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
        const { params } = this.props.match;

        if (params.username != this.props.username) {
            return <h3>У вас нет доступа к этой странице</h3>;
        }

        return (
            <div id="settings">
                <img src={this.state.imgSrc} height={200} onError={this.handleImgError} />
                <ChangePhoto updatePhoto={this.updateImg}/>
                <ChangePassword username={this.props.username} />
            </div>
        );
    }
}