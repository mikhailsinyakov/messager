'use strict';

import React from 'react';

export default class changeFriendStateBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { newFriendState } = this.props;
    }

    render() {
        return (
            <button type="button" onClick={this.handleClick}>
                {this.props.description}
            </button>
        );
    }
}