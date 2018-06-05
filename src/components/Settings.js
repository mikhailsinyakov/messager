'use strict';

import React from 'react';
import ChangeInfoForm from './ChangeInfoForm';
import ChangePhoto from './ChangePhoto';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoUrl: ''
        };

        this.setPhotoUrl = this.setPhotoUrl.bind(this);
    }

    setPhotoUrl(photoUrl) {
        this.setState({photoUrl});
    }

    render() {

        const imgSrc = this.state.photo ? this.state.photo : 'photos/placeholder.png';
        return (
            <div id="settings">
                <img src={imgSrc} width={100} height={100} />
                <ChangePhoto />
                <ChangeInfoForm username={this.props.username} 
                    setPhotoUrl={this.setPhotoUrl}/>
            </div>
        );
    }
}