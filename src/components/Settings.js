'use strict';

import React from 'react';
import ChangeInfo from './ChangeInfo';
import ChangePhoto from './ChangePhoto';
import ChangePassword from './ChangePassword';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imgSrc: `photos/${this.props.username}-avatar.jpg?ver=${new Date().getTime()}`
        };

        this.handleImgError = this.handleImgError.bind(this);
        this.updateImg = this.updateImg.bind(this);
    }

    handleImgError() {
        this.setState({imgSrc: 'photos/placeholder.png'});
    }

    updateImg() {
        const imgSrc = `photos/${this.props.username}-avatar.jpg?ver=${new Date().getTime()}`;
        this.setState({imgSrc});
    }

    render() {
        return (
            <div id="settings">
                <img src={this.state.imgSrc} height={200} onError={this.handleImgError} />
                <ChangePhoto updatePhoto={this.updateImg}/>
                <ChangeInfo username={this.props.username} />
                <ChangePassword username={this.props.username} />
            </div>
        );
    }
}