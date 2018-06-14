'use strict';

import RequestController from './requestController.client';
const requestController = new RequestController();

export default function () {

    this.getUsername = () => {
        const url = '/api/users/current?onlyUsername=true';
        return requestController.sendRequest(url);
    };

    this.getUserInfo = username => {
        const url = `/api/users/${username}`;
        return requestController.sendRequest(url);
    };

    this.getSearchResults = query => {
        const url = `/api/users?query=${query}`;
        return requestController.sendRequest(url);
    }

    this.authenticate = (url, body) => {
        const options = requestController.defineOptions('POST', body, 'application/json');
        return requestController.sendRequest(url, options);
    };

    
    this.changeUserInfo = body => {
        const url = '/api/users/current';
        const options = requestController.defineOptions('PATCH', body, 'application/json');
        return requestController.sendRequest(url, options);
    };

    this.changePhoto = body => {
        const url = '/api/users/current/files/avatar';
        const options = requestController.defineOptions('PUT', body, null, 'same-origin');
        return requestController.sendRequest(url, options);
    }

    
}