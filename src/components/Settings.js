'use strict';

import React from 'react';
import ChangeInfoForm from './ChangeInfoForm';
import ChangePhoto from './ChangePhoto';

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
                <ChangeInfoForm username={this.props.username} />
            </div>
        );
    }
}