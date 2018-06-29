'use strict';

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dialogs from './Dialogs';
import Dialog from './Dialog';

export default function DialogsRoute(props) {
    const { username, match} = props;
    if (match.params.username != username) {
        return <h1>У Вас нет доступа к этой странице</h1>;
    }
    return (
        <Switch>
            <Route 
                exact path={match.url}
                render={({match}) => <Dialogs match={match} username={username} />}
            />
            <Route 
                exact path={match.url + '/:penPalUsername'}
                render={({match}) => <Dialog match={match} username={username} />}
            />
            <Route 
                render={() => <Redirect to={match.url} />}
            />
        </Switch>
    );
}