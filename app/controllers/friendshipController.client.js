'use strict';

import RequestController from './requestController.client';
const requestController = new RequestController();

export default function () {

    this.getFriendRequestsInfo = (username, signal) => {
        const url = `/api/users/${username}/friends`;
        return requestController.sendRequest(url, undefined, signal);
    };

    this.changeFriendshipState = (username, friendUsername, state, signal) => {
        const url = `/api/users/${username}/friends/${friendUsername}`;
        const body = { state };
        const options = requestController.defineOptions('PUT', body, 'application/json');
        return requestController.sendRequest(url, options, signal);
    }

}