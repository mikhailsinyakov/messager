'use strict';

import RequestController from './requestController.client';
const requestController = new RequestController();

export default function () {

    this.getUsername = signal => {
        const url = '/api/users/current?onlyUsername=true';
        return requestController.sendRequest(url, undefined, signal);
    };

    this.getUserInfo = (username, signal) => {
        const url = `/api/users/${username}`;
        return requestController.sendRequest(url, undefined, signal);
    };

    this.getSearchResults = (query, signal) => {
        const url = `/api/users?query=${query}`;
        return requestController.sendRequest(url, undefined, signal);
    }

    this.authenticate = (url, body, signal) => {
        const options = requestController.defineOptions('POST', body, 'application/json');
        return requestController.sendRequest(url, options, signal);
    };

    
    this.changeUserInfo = (body, signal) => {
        const url = '/api/users/current';
        const options = requestController.defineOptions('PATCH', body, 'application/json');
        return requestController.sendRequest(url, options, signal);
    };

    this.changePhoto = (body, signal) => {
        const url = '/api/users/current/files/avatar';
        const options = requestController.defineOptions('PUT', body, null, 'same-origin');
        return requestController.sendRequest(url, options, signal);
    }

    this.abortRequest = () => {
        requestController.abortRequest();
    }
}